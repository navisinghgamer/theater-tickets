import {Filter} from '@loopback/filter';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {TicketController} from '../../../controllers/ticket.controller';
import {Ticket} from '../../../models/ticket.model';
import {TicketRepository} from '../../../repositories/ticket.repository';
import {givenTicket} from '../../helpers/database.helpers';

describe('TicketController', () => {
  let repository: StubbedInstanceWithSinonAccessor<TicketRepository>;

  /* Method Stubs */
  let create: sinon.SinonStub;
  let findById: sinon.SinonStub;
  let find: sinon.SinonStub;
  let replaceById: sinon.SinonStub;
  let updateById: sinon.SinonStub;
  let deleteById: sinon.SinonStub;

  /* Test Variables */
  let controller: TicketController;
  let aTicket: Ticket;
  let aTicketWithId: Ticket;
  let aChangedTicket: Ticket;
  let aListOfTickets: Ticket[];

  beforeEach(resetRepositories);

  describe('createTicket', () => {
    it('creates a Ticket', async () => {
      create.resolves(aTicketWithId);
      const result = await controller.create(aTicket);
      expect(result).to.eql(aTicketWithId);
      sinon.assert.calledWith(create, aTicket);
    });
  });

  describe('findTicketById', () => {
    it('returns a ticket if it exists', async () => {
      findById.resolves(aTicketWithId);
      expect(await controller.findById(aTicketWithId.id)).to.eql(aTicketWithId);
      sinon.assert.calledWith(findById, aTicketWithId.id);
    });
  });

  describe('findTickets', () => {
    it('returns multiple tickets if they exists', async () => {
      find.resolves(aListOfTickets);
      expect(await controller.find()).to.eql(aListOfTickets);
      sinon.assert.called(find);
    });

    it('returns empty list if no ticket exist', async () => {
      const expected: Ticket[] = [];
      find.resolves(expected);
      expect(await controller.find()).to.eql(expected);
      sinon.assert.called(find);
    });

    it('uses the provided filter', async () => {
      const filter: Filter<Ticket> = {where: {customerName: 'Navi Singh'}};

      find.resolves(aListOfTickets);
      await controller.find(filter);
      sinon.assert.calledWith(find, filter);
    });
  });

  describe('replaceTicket', () => {
    it('successfully replaces existing items', async () => {
      replaceById.resolves();
      await controller.replaceById(aTicketWithId.id, aChangedTicket);
      sinon.assert.calledWith(replaceById, aTicketWithId.id, aChangedTicket);
    });
  });

  describe('updateTicket', () => {
    it('successfully updates existing items', async () => {
      updateById.resolves();
      await controller.updateById(aTicketWithId.id, aChangedTicket);
      sinon.assert.calledWith(updateById, aTicketWithId.id, aChangedTicket);
    });
  });

  describe('deleteTicket', () => {
    it('successfully deletes existing items', async () => {
      deleteById.resolves();
      await controller.deleteById(aTicketWithId.id);
      sinon.assert.calledWith(deleteById, aTicketWithId.id);
    });
  });

  function resetRepositories() {
    repository = createStubInstance(TicketRepository);
    aTicket = givenTicket();
    aTicketWithId = givenTicket({
      id: '1',
    });
    aListOfTickets = [
      aTicketWithId,
      givenTicket({
        id: '2',
        customerName: 'Navneet Singh',
      }),
    ] as Ticket[];
    aChangedTicket = givenTicket({
      id: aTicketWithId.id,
      customerName: 'Navneet Navi Singh',
    });

    /* Setup CRUD fakes */
    ({
      create,
      findById,
      find,
      updateById,
      replaceById,
      deleteById,
    } = repository.stubs);

    controller = new TicketController(repository);
  }
});
