import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {TheaterDataSource} from '../datasources';
import {Ticket, TicketRelations} from '../models';

export class TicketRepository extends DefaultCrudRepository<
  Ticket,
  typeof Ticket.prototype.id,
  TicketRelations
> {
  constructor(@inject('datasources.theater') dataSource: TheaterDataSource) {
    super(Ticket, dataSource);
  }

  /**
   * @param [method] method type to process data DB aggregation or JS Algorithm
   * @param [fromDate] fetch records from date
   * @param [toDate] fetch records to date
   * @returns {object[]} Summary of profit per month basis
   */
  async getProfitSummary(
    method: string,
    fromDate: string,
    toDate: string,
    filter?: Filter<Ticket>,
  ): Promise<object[]> {
    if (fromDate === undefined || fromDate === '') {
      throw new HttpErrors.UnprocessableEntity(
        'missingProperty `fromDate`: From Date is required',
      );
    }

    if (toDate === undefined || toDate === '') {
      throw new HttpErrors.UnprocessableEntity(
        'missingProperty `toDate`: To Date is required',
      );
    }

    let summary: object[];

    switch (method) {
      case 'algorithm':
        summary = await this.getProfitSummaryByAlgo(fromDate, toDate, filter);
        break;

      case 'aggregation':
      default:
        summary = await this.getProfitSummaryByAggre(fromDate, toDate);
        break;
    }

    return summary;
  }

  async getProfitSummaryByAlgo(
    fromDate: string,
    toDate: string,
    filter?: Filter<Ticket>,
  ): Promise<object[]> {
    filter = {
      where: {
        and: [
          {performanceTime: {gte: new Date(fromDate)}},
          {performanceTime: {lte: new Date(toDate)}},
        ],
      },
      order: ['performanceTime ASC'],
    };

    const ticketList = await this.find(filter);

    const f = function (ticket: Ticket) {
      const monthName = new Date(
        ticket.performanceTime,
      ).toLocaleString('default', {month: 'long'});

      return {
        month: monthName,
        amount: ticket.ticketPrice,
      };
    };

    const monthWithAmt: {month: string; amount: number}[] = ticketList.map(f);

    const reducer = function (
      accumulator: {[key: string]: number},
      currentValue: {month: string; amount: number},
    ) {
      if (accumulator[currentValue.month] === undefined) {
        accumulator[currentValue.month] = currentValue.amount;
      } else {
        accumulator[currentValue.month] += currentValue.amount;
      }

      return accumulator;
    };

    const monthWiseSummary = monthWithAmt.reduce(reducer, {});

    const summary = [];

    for (const key in monthWiseSummary) {
      if (Object.prototype.hasOwnProperty.call(monthWiseSummary, key)) {
        const profit = monthWiseSummary[key];
        summary.push({
          month: key,
          summaryProfit: profit,
        });
      }
    }

    return summary;
  }

  async getProfitSummaryByAggre(
    fromDate: string,
    toDate: string,
  ): Promise<object[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TicketCollection = (this.dataSource.connector as any).collection(
      'Ticket',
    );

    const summary = await TicketCollection.aggregate([
      {
        $match: {
          $and: [
            {
              performanceTime: {
                $gte: new Date(fromDate),
              },
            },
            {
              performanceTime: {
                $lte: new Date(toDate),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {$month: '$performanceTime'},
          summaryProfit: {$sum: '$ticketPrice'},
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          summaryProfit: '$summaryProfit',
        },
      },
      {
        $addFields: {
          month: {
            $let: {
              vars: {
                monthArray: [
                  '',
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
              },
              in: {
                $arrayElemAt: ['$$monthArray', '$month'],
              },
            },
          },
        },
      },
    ]).get();

    return summary;
  }

  /**
   * @param [method] method type to process data DB aggregation or JS Algorithm
   * @param [fromDate] fetch records from date
   * @param [toDate] fetch records to date
   * @returns {object[]} Summary of visits per month basis
   */
  async getVisitsSummary(
    method: string,
    fromDate: string,
    toDate: string,
    filter?: Filter<Ticket>,
  ): Promise<object[]> {
    if (fromDate === undefined || fromDate === '') {
      throw new HttpErrors.UnprocessableEntity(
        'missingProperty `fromDate`: From Date is required',
      );
    }

    if (toDate === undefined || toDate === '') {
      throw new HttpErrors.UnprocessableEntity(
        'missingProperty `toDate`: To Date is required',
      );
    }

    let summary: object[];

    switch (method) {
      case 'algorithm':
        summary = await this.getVisitsSummaryByAlgo(fromDate, toDate, filter);
        break;

      case 'aggregation':
      default:
        summary = await this.getVisitsSummaryByAggre(fromDate, toDate);
        break;
    }

    return summary;
  }

  async getVisitsSummaryByAlgo(
    fromDate: string,
    toDate: string,
    filter?: Filter<Ticket>,
  ): Promise<object[]> {
    filter = {
      where: {
        and: [
          {performanceTime: {gte: new Date(fromDate)}},
          {performanceTime: {lte: new Date(toDate)}},
        ],
      },
      order: ['performanceTime ASC'],
    };

    const ticketList = await this.find(filter);

    const f = function (ticket: Ticket) {
      const monthName = new Date(
        ticket.performanceTime,
      ).toLocaleString('default', {month: 'long'});

      return {
        month: monthName,
        visits: 1,
      };
    };

    const monthWithVisit: {month: string; visits: number}[] = ticketList.map(f);

    const reducer = function (
      accumulator: {[key: string]: number},
      currentValue: {month: string; visits: number},
    ) {
      if (accumulator[currentValue.month] === undefined) {
        accumulator[currentValue.month] = currentValue.visits;
      } else {
        accumulator[currentValue.month] += currentValue.visits;
      }

      return accumulator;
    };

    const monthWiseSummary = monthWithVisit.reduce(reducer, {});

    const summary = [];

    for (const key in monthWiseSummary) {
      if (Object.prototype.hasOwnProperty.call(monthWiseSummary, key)) {
        const visits = monthWiseSummary[key];
        summary.push({
          month: key,
          summaryVisits: visits,
        });
      }
    }

    return summary;
  }

  async getVisitsSummaryByAggre(
    fromDate: string,
    toDate: string,
  ): Promise<object[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TicketCollection = (this.dataSource.connector as any).collection(
      'Ticket',
    );

    const summary = await TicketCollection.aggregate([
      {
        $match: {
          $and: [
            {
              performanceTime: {
                $gte: new Date(fromDate),
              },
            },
            {
              performanceTime: {
                $lte: new Date(toDate),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {$month: '$performanceTime'},
          summaryVisits: {$sum: 1},
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          summaryVisits: '$summaryVisits',
        },
      },
      {
        $addFields: {
          month: {
            $let: {
              vars: {
                monthArray: [
                  '',
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
              },
              in: {
                $arrayElemAt: ['$$monthArray', '$month'],
              },
            },
          },
        },
      },
    ]).get();

    return summary;
  }
}
