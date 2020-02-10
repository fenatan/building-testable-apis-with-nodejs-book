import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res, next) => res.send('Hello Nodeee!'));

//middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Error!');
});

export default app;


