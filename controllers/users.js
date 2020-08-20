const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');

usersRouter.post('/create', async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = {
    username,
    hash,
  };
  jwt.sign({ user }, config.SECRET_KEY, (err, token) => {
    return res.json(token);
  });
});

usersRouter.post('/login', (req, res) => {
  jwt.verify(req.token, config.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: 'invalid login' });
    }
    return res.sendStatus(200);
  });
});
