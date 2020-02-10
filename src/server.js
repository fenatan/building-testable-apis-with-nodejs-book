import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => next(new Error('Rota home quebrou')));

//middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Error!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000!')
})
