const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const todosRouter = require('./controllers/todos');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, connectOptions)
  .then(() => {
    logger.info('connected to to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
