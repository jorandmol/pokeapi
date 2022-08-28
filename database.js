const mongoose = require('mongoose');
let dbName = process.env.NODE_ENV === 'test' ? 'test' : 'db';

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.yzjmukd.mongodb.net/?retryWrites=true&w=majority`,
    { dbName: dbName }
);