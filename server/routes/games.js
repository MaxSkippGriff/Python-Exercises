const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Game = require("../models/game");
const {check_api_token} = require('./middleware');
const { isTemplateExpression } = require('typescript');

router.use(check_api_token);
router.get('/', (req, res) => {
    res.send('games api works');
  });

//Add a new game instance
router.post('/:gamename', async (req, res) => {
  if(req.params.gamename.toLowerCase()==='memorygame'){gamename='Memory Game'}
  else if(req.params.gamename.toLowerCase() ==='connect4'){gamename = 'Connect 4'}
  else{
    res.status(400).json({error: "invalid parameter of gamename"})
  }
  body = req.body
  if(!body.players){
    return res.status(400).json({error: "cannot find the player data for the game instance"})
  }
  gameInstance = new Game ({
    gameName: gamename,
    players: body.players
    // diffcultylevel: body.diffcultylevel
  })
  players = body.players
  players.forEach(player => updateUserGameHistory(player, players, gamename))
  await gameInstance.save(gameInstance);
  return res.status(201).json({result: "game added"})
})

async function updateUserGameHistory(player, players, gamename)
{
  const targetPlayer = await User.findOne({username: player.username})
  newPlayedWith = []
  const newGame = {
    gamename: gamename,
    result: player.result.toLowerCase(),
    playedWith: newPlayedWith
  }
  if(newGame.result==='win') {
    if(!targetPlayer.wins) targetPlayer.wins = 1
    else{
      targetPlayer.wins++
    }
  }
  players.filter(player => player.username!==targetPlayer.username)
     .forEach(otherPlayer => newGame.playedWith.push(otherPlayer.username))
  try{
    await targetPlayer.gamesPlayed.push(newGame)
  }catch(err){
    return res.status(400).json({error: "fail to add the game, invalid gamename/gameresult"})
  }
  await targetPlayer.save(targetPlayer)
}

//get the leaderboard of a specific game
router.get('/scores/:gamename/:limit/:order', async (req, res) => {
  if(req.params.gamename==='memorygame'){targetGame='Memory Game'}
  else if(req.params.gamename==='connect4'){targetGame = 'Connect 4'}
  else{return res.status(400).json({error: 'not valid gamename parameter'})}
  limit = req.params.limit
  order = req.params.order
  result = []
  if(!targetGame || !limit) return res.status(400).json({error: 'invalid parameters'})
  await (await (Game.find({gameName: targetGame}, {_id: 0}))).forEach(function(gameInstance){
    gameInstance.players.forEach(function(player){
      score = player.score
      if(score>0){
        record = {}
        record.score=score
        record.username=player.username
        result.push(record)
        score = 0
      }
    })
  })
  if(req.params.order == 1) {
    result = result.sort((a, b) => a.score - b.score).slice(0, limit)
  }
  if(req.params.order === 0){
    result = result.sort((a, b) => b.score - a.score).slice(0, limit)
  }
  res.status(200).json(result)
})
router.get('*', (req, res) => {
  res.status(400).json({error: "invalid request"})
})


module.exports = router;