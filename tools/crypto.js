const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = (plainTextPwd, done) => {
    bcrypt.hash(plainTextPwd, saltRounds, done);
}

const hashPasswordSync = (plainTextPwd) => {
    return bcrypt.hashSync(plainTextPwd, saltRounds);
}

const comparePassword = (plainTextPwd, hashedPassword, done) => {
    bcrypt.compare(plainTextPwd, hashedPassword, done);
}

exports.hashPassword = hashPassword;
exports.hashPasswordSync = hashPasswordSync;
exports.comparePassword = comparePassword;