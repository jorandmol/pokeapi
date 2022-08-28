const bodyParser = require('body-parser');
const authMiddleware = require('./tools/auth.middleware');

const setUpMiddlewares = (app) => {
    app.use(bodyParser.json());
    authMiddleware.init();
    app.use(authMiddleware.protectWithJwt);
}

exports.setUpMiddlewares = setUpMiddlewares;