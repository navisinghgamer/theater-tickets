import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'theater',
  connector: 'mongodb',
  url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
  protocol: 'mongodb+srv',
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT ?? 27017,
  user: process.env.MONGO_USER ?? '',
  password: process.env.MONGO_PASSWORD ?? '',
  database: process.env.MONGO_DATABASE ?? '',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TheaterDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'theater';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.theater', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
