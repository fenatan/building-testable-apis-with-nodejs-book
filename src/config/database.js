import mongoose from 'mongoose';

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://admin:admin@localhost:27017/test';
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