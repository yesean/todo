const { isValid, parseJSON } = require('date-fns');
const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---');
  next();
};

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.sendStatus(403);
  }
  const { bearerHeader } = req.headers.authorization;
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.sendStatus(403);
  }
};

const isValidTodo = (todo) => {
  // missing content
  if (!todo.content) {
    return { error: 'content missing' };
  }

  // incorrectly formatted dueDate
  if (!todo.dueDate || !isValid(parseJSON(todo.dueDate))) {
    return { error: 'invalid date' };
  }

  // incorrectly formatted finished
  if (todo.finished && typeof todo.finished !== 'boolean') {
    return { error: 'invalid finished' };
  }

  return {};
};

const verifyTodo = (req, res, next) => {
  // check todo format
  const result = isValidTodo(req.body);
  if (result.error) {
    logger.info(result.error);
    return res.status(400).json(result.error);
  }
  req.body.dueDate = parseJSON(req.body.dueDate);
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestLogger,
  verifyToken,
  verifyTodo,
  unknownEndpoint,
  errorHandler,
};
