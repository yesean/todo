const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const isPasswordCorrect =
    user !== null && (await bcrypt.compare(password, user.passwordHash));

  if (!user) {
    return res.status(401).json({ error: 'invalid username' });
  }
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'invalid password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET_KEY);

  res.send({ token, username: user.username });
});

module.exports = loginRouter;
