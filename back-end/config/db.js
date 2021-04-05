require('dotenv').config();
const mongoose = require('mongoose');


function connectDB() {
    //Database Connection
    mongoose.connect(process.env.MONGO_SECURE_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database Connected.');
    }).catch(err => {
        console.log('Connection Failed.');
    })
}

module.exports = connectDB;