const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');

router.post('/players', playerController.getPlayers);
router.post('/players/add', playerController.add);

module.exports = router;