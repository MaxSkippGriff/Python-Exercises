const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../../db');
mongoose.set('useFindAndModify', false);

//import routes and use them as middlewares
const usersRoute = require("./users");
const gamesRoute = require("./games");

router.use('/users', usersRoute);
router.use('/games', gamesRoute);

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('*', (req, res) => {
  res.status(400).json({})
})

// middlewares (e.g. user authentication by app.use(auth))

module.exports = router;
