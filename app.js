const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const todosRouter = require('./controllers/todos');

const app = express();

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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

app.use(middleware.verifyToken);
app.use(middleware.verifyTodo);
app.use('/api/todos', todosRouter);

app.use(middleware.errorHandler);

module.exports = app;
