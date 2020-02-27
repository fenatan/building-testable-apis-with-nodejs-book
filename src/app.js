import express from 'express';
import bodyParser from 'body-parser';
import acl from 'express-acl';
import routes from './routes';
import database from './database';
import authMiddleware from './middlewares/auth';

const app = express();

acl.config({
  baseUrl: '/',
  path: 'config',
});

const configureExpress = () => {
  app.use(bodyParser.json());
  app.use(authMiddleware);
  app.use(acl.authorize.unless({ path: ['/users/authenticate'] }));
  app.use('/', routes);
  app.database = database;

  // middleware para tratamento de erros
  app.use((error, req, res) => {
    res.status(500).send('Internal Error!');
  });

  return app;
};

export default async () => {
  const server = configureExpress();
  await server.database.connect();

  return server;
};
