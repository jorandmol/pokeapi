const mongoose = require('mongoose');

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.yzjmukd.mongodb.net/?retryWrites=true&w=majority`,
    { dbName: process.env.NODE_ENV }
);