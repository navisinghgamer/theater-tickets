import {juggler} from '@loopback/repository';

export const theater: juggler.DataSource = new juggler.DataSource({
  name: 'theater',
  connector: 'memory',
});
