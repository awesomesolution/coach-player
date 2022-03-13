const mongoose = require('mongoose');
const Schema = mongoose.Schema;

playerSchema = new Schema({
	name: String,
	matchesPlayed: Number,
	matchesWon: Number,
	matchesLost: Number,
	efficiency: Number,
	coacheId: Schema.ObjectId,
	date: { type: Date, default: Date.now }
}),
	Players = mongoose.model('Players', playerSchema);

module.exports = Players;