const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  name: {type: String},
  surname: {type:String},
  age: {type: Number},
  gender: {type: String},
  location: {type: String},
  wins: {type: Number},
  friends: [{type: String}],
  gamesPlayed: [{
    gamename:{type: String},
    date: {type: Date, default: Date.now},
    playedWith: [{type: String}],
    result:{type: String}}]
});

module.exports = mongoose.model('User', User);