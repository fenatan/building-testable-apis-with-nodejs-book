import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use('/', routes);

//middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Error!');
});

export default app;


