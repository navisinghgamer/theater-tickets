import {Entity, model, property} from '@loopback/repository';

@model()
export class Ticket extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  customerName: string;

  @property({
    type: 'string',
    required: true,
  })
  performanceTitle: string;

  @property({
    type: 'date',
    required: true,
  })
  performanceTime: Date;

  @property({
    type: 'number',
    required: true,
  })
  ticketPrice: number;

  @property({
    type: 'date',
    required: true,
  })
  creationDate: Date;

  constructor(data?: Partial<Ticket>) {
    super(data);
  }
}

export interface TicketRelations {
  // describe navigational properties here
}

export type TicketWithRelations = Ticket & TicketRelations;
