const axios = require('axios');

const { to } = require('../tools/to');

// Controladores asociados
const usersController = require('../auth/users.controller');
const teamsController = require('./teams.controller');

const getTeamFromUser = async (req, res) => {
    const user = await usersController.getUser(req.user.userId);
    let team = await teamsController.getUserTeam(req.user.userId); 
    res.status(200).json({
        trainer: user.userName,
        team: team
    });
}

const updateTeamFromUser = (req, res) => {
    teamsController.setTeam(req.user.userId, req.body.team);
    res.status(200).send();
}

const addPokemonToUserTeam = async (req, res) => {
    let pokemonName = req.body.name;
    let [pokeapiError, pokeapiResponse] =
        await to(axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`));
    if (pokeapiError) {
        res.status(400).json({ message: pokeapiError.message });
    } else {
        let pokemon = {
            name: pokemonName,
            pokedexId: pokeapiResponse.data.id
        };
        let [controllerError, controllerResponse] =
            await to(teamsController.addPokemon(req.user.userId, pokemon));
        if (controllerError) {
            res.status(400).json({ message: 'Ya tienes 6 pokemon en el equipo' });
        } else {
            res.status(201).json(pokemon);
        }
    }
}

const deletePokemonFromUserTeam = async (req, res) => {
    const userId = req.user.userId;
    const pokemonId = req.params.id - 1;
    let team = await teamsController.getUserTeam(userId);
    if (team.team[pokemonId]) {
        teamsController.deletePokemonAt(userId, pokemonId);
        res.status(200).send();
    } else {
        res.status(404).json({ message: 'No existe pokemon en esa posición'});
    }
}

exports.getTeamFromUser = getTeamFromUser;
exports.updateTeamFromUser = updateTeamFromUser;
exports.addPokemonToUserTeam = addPokemonToUserTeam;
exports.deletePokemonFromUserTeam = deletePokemonFromUserTeam;