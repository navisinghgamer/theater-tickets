import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import * as dotenv from 'dotenv';
import {TheaterTicketsApplication} from '../..';
import {theater} from '../fixtures/datasources/theater.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  // dotenv config
  dotenv.config({path: '.env'});

  const restConfig = givenHttpServerConfig({
    port: +(process.env.PORT ?? 3000),
    host: process.env.HOST,
  });

  const app = new TheaterTicketsApplication({
    rest: restConfig,
  });

  await app.boot();

  /* Override default config for datasource */
  app.bind('datasources.config.theater').to(theater);

  /* Start Application */
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TheaterTicketsApplication;
  client: Client;
}
