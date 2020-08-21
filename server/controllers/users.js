const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('todos');
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

usersRouter.post('/login', (req, res) => {
  jwt.verify(req.token, config.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: 'invalid login' });
    }
    return res.sendStatus(200);
  });
});

module.exports = usersRouter;
