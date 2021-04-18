import {Ticket} from '../../models';
import {TicketRepository} from '../../repositories/ticket.repository';
import {theater} from '../fixtures/datasources/theater.datasource';

export async function givenEmptyDatabase() {
  await new TicketRepository(theater).deleteAll();
}

export function givenTicketData(data?: Partial<Ticket>) {
  return Object.assign(
    {
      customerName: 'Navi Singh',
      performanceTitle: 'My First Performance',
      performanceTime: new Date('2021-04-15T00:00:00Z'),
      ticketPrice: 43,
      creationDate: new Date('2021-04-15T00:00:00Z'),
    },
    data,
  );
}

export function givenTicket(data?: Partial<Ticket>) {
  return new Ticket(givenTicketData(data));
}
