const crypto = require('../tools/crypto');
const uuid = require('uuid');

const { to } = require('../tools/to');

const teamsController = require('../teams/teams.controller');

const mongoose = require('mongoose');
const UserModel = mongoose.model('User', {
    userId: String,
    userName: String,
    password: String
});

const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getUserFromUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ userName: userName }).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const registerUser = (userName, password) => {
    return new Promise(async (resolve, reject) => {
        const passwordEncrypted = crypto.hashPasswordSync(password);
        // Guardar en la BD el usuario
        const userId = uuid.v4();
        let newUser = new UserModel({
            userId: userId,
            userName: userName,
            password: passwordEncrypted
        });
        await newUser.save();
        // Crear una entrada vacía en la tabla de equipos
        await teamsController.bootstrapTeam(userId);
        resolve();
    });
}

const checkUserCredentials = (userName, password) => {
    // Comprobar que las credenciales son correctas
    return new Promise(async (resolve, reject) => {
        let user = await getUserFromUserName(userName);
        if (user) {
            crypto.comparePassword(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject('No se ha encontrado al usuario');
        }
    });
}

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    });
}

exports.getUser = getUser;
exports.getUserFromUserName = getUserFromUserName;
exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.cleanUpUsers = cleanUpUsers;