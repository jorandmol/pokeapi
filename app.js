const express = require('express');
const middlewares = require('./middlewares');
require('dotenv').config();
require('./database');

// Rutas o módulos de rutas
const authRoutes = require('./auth/auth.router').router;
const teamRoute = require('./teams/teams.router').router;

const app = express();
const port = 3000;

middlewares.setUpMiddlewares(app);

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.use('/auth', authRoutes);
app.use('/teams', teamRoute);

app.listen(port, () => {
    console.log('Server listening at port 3000');
});

exports.app = app;