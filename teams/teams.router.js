const express = require('express');
const router = express.Router();

const teamsHttpHandler = require('./teams.http');

router.route('/')
    .get(teamsHttpHandler.getTeamFromUser)
    .put(teamsHttpHandler.updateTeamFromUser);

router.route('/pokemons')
    .post(teamsHttpHandler.addPokemonToUserTeam);

router.route('/pokemons/:id')
    .delete(teamsHttpHandler.deletePokemonFromUserTeam);

exports.router = router;