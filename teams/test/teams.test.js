const chai = require('chai');
const chaiHttp = require('chai-http');

const usersController = require('../../auth/users.controller');
const teamsController = require('../teams.controller');

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

describe('Suite de pruebas team', () => {
    it('should return the given user\'s team', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                chai.request(app)
                    .get('/teams')
                    .set('Authorization', `JWT ${res.body.token}`)
                    .end((err, res) => {
                        // Pepe tiene un equipo con Charizard y Blastoise
                        chai.assert.equal(res.statusCode, 200);
                        chai.assert.equal(res.body.trainer, 'pepe');
                        chai.assert.equal(res.body.team.team.length, 0);
                        done();
                    });
            });
    });

    it('should return the given user\'s team after making changes in it', (done) => {
        let team = [{ name: 'Charizard'}, { name: 'Blastoise'}];
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                const token = res.body.token;
                chai.request(app)
                    .put('/teams')
                    .send({ team: team })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        // Pepe tiene un equipo con Charizard y Blastoise
                        chai.request(app)
                            .get('/teams')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // Pepe tiene un equipo con Charizard y Blastoise
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'pepe');
                                chai.assert.equal(res.body.team.team.length, 2);
                                chai.assert.equal(res.body.team.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team.team[1].name, team[1].name);
                                done();
                            });
                    });
            });
    });

    it('should return the pokedex number after adding new pokemon to the team', (done) => {
        let pokemonName = 'Bulbasaur';
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                const token = res.body.token;
                chai.request(app)
                    .post('/teams/pokemons')
                    .send({ name: pokemonName })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .get('/teams')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'pepe');
                                chai.assert.equal(res.body.team.team.length, 1);
                                chai.assert.equal(res.body.team.team[0].name, pokemonName);
                                chai.assert.equal(res.body.team.team[0].pokedexId, 1);
                                done();
                            });
                    });
            });
    });

    it('should return OK when deleting a pokemon', (done) => {
        let pokemonName = 'Bulbasaur';
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                const token = res.body.token;
                chai.request(app)
                    .post('/teams/pokemons')
                    .send({ name: pokemonName })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            // Borrar el pokemon recién añadido
                            .delete('/teams/pokemons/1')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // Comprobar que se ha borrado correctamente
                                chai.assert.equal(res.statusCode, 200);
                                // Ver el tamaño del equipo
                                chai.request(app)
                                    .get('/teams')
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {
                                        chai.assert.equal(res.body.team.team.length, 0);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should return error when adding the seventh pokemon to the team', (done) => {
        let team = [
            { name: 'Charizard'},
            { name: 'Blastoise'},
            { name: 'Bulbasaur'},
            { name: 'Pikachu'},
            { name: 'Ekans'},
            { name: 'Meowth'}
        ];
        chai.request(app)
            .post('/auth/login')
            .set('Content-type', 'application/json')
            .send({ user: 'pepe', password: 'fon'})
            .end((err, res) => {
                const token = res.body.token;
                chai.request(app)
                    .put('/teams')
                    .send({ team: team })
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .post('/teams/pokemons')
                            .send({ name: 'Pidgey' })
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 400);
                                done();
                            });
                        });
            });
    });
});