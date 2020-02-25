import mongoose from 'mongoose';
import config from 'config';

const mongodbUrl = config.get('database.mongoUrl');

//'mongodb://admin:admin@localhost:27017/test';
//'mongodb://admin:admin@localhost:27017/herois'
const connect = () =>
    mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

export default {
    connect,
    connection: mongoose.connection
}