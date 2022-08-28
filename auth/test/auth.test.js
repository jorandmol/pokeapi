const chai = require('chai');
const chaiHttp = require('chai-http');

const usersController = require('../users.controller');
const teamsController = require('../../teams/teams.controller');

chai.use(chaiHttp);

const app = require('../../app').app;

// Limpiar el estado de la BD para hacer bien los test
beforeEach(async () => {
    await usersController.registerUser('pepe', 'fon');
    await usersController.registerUser('jorge', 'ana');
});

afterEach(async () => {
    await teamsController.cleanUpTeams();
    await usersController.cleanUpUsers();
});

describe('Suite de pruebas auth', () => {
    it('should return 401 when no jwt token available', (done) => {
        // La llamada no tiene la llave correcta
        chai.request(app)
            .get('/teams')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            })
    });

    it('should return 200 when jwt is valid', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                chai.request(app)
                    .get('/teams')
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        chai.assert.equal(res.statusCode, 200);
                        done();
                    });
            });
    });
});