const jwt = require('jsonwebtoken');

const { to } = require('../tools/to');

// Controladores asociados
const usersController = require('./users.controller');

const userLogin = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Missing data' });
    } else if (!req.body.user || !req.body.password) {
        return res.status(400).json({ message: 'Missing data' });
    }
    // Comprobamos credenciales
    let [err, resp] = 
        await to(usersController.checkUserCredentials(req.body.user, req.body.password));
    // Si no son válidas, error
    if (err || !resp) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Si son validas, generamos un JWt y lo devolvemos
    const user = await usersController.getUserFromUserName(req.body.user);
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ token: token });   
}

exports.userLogin = userLogin;