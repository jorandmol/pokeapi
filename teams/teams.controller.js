const { to } = require('../tools/to');

const mongoose = require('mongoose');
const TeamModel = mongoose.model('Team', {
    userId: String,
    team: []
});

const getUserTeam = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, team] = await to(TeamModel.findOne({ userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(team || []);
    });
}

const bootstrapTeam = (userId) => {
    return new Promise(async (resolve, reject) => {
        let newTeam = new TeamModel({
            userId: userId,
            team: []
        });
        await newTeam.save();
        resolve();
    });
}

const addPokemon = (userId, pokemon) => {
    return new Promise(async (resolve, reject) => {
        let [err, team] = await to(TeamModel.findOne({ userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        if (team.team.length === 6) {
            return reject('Ya tienes 6 pokemons');
        } else {
            team.team.push(pokemon);
            await team.save();
            resolve();
        }
    });
}

const deletePokemonAt = (userId, pokemonId) => {
    return new Promise(async (resolve, reject) => {
        let [err, team] = await to(TeamModel.findOne({ userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        if (team.team[pokemonId]) {
            team.team.splice(pokemonId, 1);
        }
        await team.save();
        resolve();
    });
}

const setTeam = (userId, newTeam) => {
    return new Promise(async (resolve, reject) => {
        let [err, team] = await to(TeamModel.findOne({ userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        team.team = newTeam;
        await team.save();
        resolve();
    });
}

const cleanUpTeams = () => {
    return new Promise(async (resolve, reject) => {
        await TeamModel.deleteMany({}).exec();
        resolve();
    });
}

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getUserTeam = getUserTeam;
exports.cleanUpTeams = cleanUpTeams;
exports.deletePokemonAt = deletePokemonAt;