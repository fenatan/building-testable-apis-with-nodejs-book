import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import database from './config/database';

const app = express();

const configureExpress = () => {
    app.use(bodyParser.json());
    app.use('/', routes);
    app.database = database;

    //middleware para tratamento de erros
    app.use((error, req, res, next) => {
        console.error(error);
        res.status(500).send('Internal Error!');
    });

    return app;
}

export default async () => {
    const app = configureExpress();
    await app.database.connect();

    return app;
};


