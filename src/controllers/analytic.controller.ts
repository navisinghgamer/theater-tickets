import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {TicketRepository} from '../repositories';

@authenticate('static')
export class AnalyticController {
  constructor(
    @repository(TicketRepository)
    public ticketRepository: TicketRepository,
  ) {}

  @get('/analytics/profit')
  @response(200, {
    description: 'Profit earned by Theater in a specific period',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            title: 'ProfitEarned',
            type: 'object',
            properties: {
              month: {
                type: 'string',
              },
              summaryProfit: {
                type: 'number',
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
  })
  async getProfitSummary(
    @param.query.string('method') method: string,
    @param.query.string('fromDate') fromDate: string,
    @param.query.string('toDate') toDate: string,
  ): Promise<object[]> {
    return this.ticketRepository.getProfitSummary(method, fromDate, toDate);
  }

  @get('/analytics/visited')
  @response(200, {
    description: 'People visited Theater in a specific period',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            title: 'PeopleVisited',
            type: 'object',
            properties: {
              month: {
                type: 'string',
              },
              summaryVisits: {
                type: 'number',
              },
            },
            additionalProperties: false,
          },
        },
      },
    },
  })
  async getVisitsSummary(
    @param.query.string('method') method: string,
    @param.query.string('fromDate') fromDate: string,
    @param.query.string('toDate') toDate: string,
  ): Promise<object[]> {
    return this.ticketRepository.getVisitsSummary(method, fromDate, toDate);
  }
}
