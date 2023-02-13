var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    gameName: {type: String, required: true},
    date: {type: Date, default: Date.now},
    players: [{
        username: {type: String, required: true}, //player1's username
        result: {type: String, required: true},
        score: {type: Number}
    }],
    difficultyLevel: {type: String}, // not required
  });
  
  module.exports = mongoose.model('Game', Game);