/* eslint-disable no-prototype-builtins */
require('dotenv').config();
const { isValid, parseJSON } = require('date-fns');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Todo = require('./models/todo');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

const privateKey = 'privateKey';

// home page
app.get('/', (req, res) => {
  res.send('<p>this is the server for todo!</p>');
});

app.post('api/accout/create', async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = {
    username,
    hash,
  };
  jwt.sign({ user }, privateKey, (err, token) => {
    return res.json(token);
  });
});

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

app.use(verifyToken);

app.post('/api/account/login', (req, res) => {
  jwt.verify(req.token, privateKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: 'invalid login' });
    }
    return res.sendStatus(200);
  });
});

// get all todos
app.get('/api/todos', (req, res) => {
  jwt.verify(req.token, privateKey, (error, decoded) => {
    if (error) {
      return res.sendStatus(403);
    }
    return Todo.find({}).then((todos) => res.json(todos));
  });
});

// get specific todo based on id
app.get('/api/todos/:id', (req, res, next) => {
  const { id } = req.params;
  Todo.findById(id)
    .then((todo) => res.json(todo))
    .catch((error) => next(error));
});

// delete todo based on id
app.delete('/api/todos/:id', (req, res, next) => {
  const { id } = req.params;

  return Todo.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

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

app.use((req, res, next) => {
  // check todo format
  const result = isValidTodo(req.body);
  if (result.error) {
    console.log(result.error);
    return res.status(400).json(result.error);
  }
  req.body.dueDate = parseJSON(req.body.dueDate);
  next();
});

// insert new todo
app.post('/api/todos/', async (req, res) => {
  const { body } = req;

  // duplicate todo
  const isDuplicate = await Todo.exists({
    content: body.content,
    dueDate: body.dueDate,
  });
  if (isDuplicate) {
    return res.status(400).json({ error: 'todo already exists' });
  }

  const createdDate = new Date();
  const todoToAdd = new Todo({
    content: body.content,
    dueDate: body.dueDate,
    finished: body.finished || false,
    createdDate,
  });

  return todoToAdd.save().then((savedTodo) => {
    return res.json(savedTodo);
  });
});

// update existing todo
app.put('/api/todos/:id', async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const updatedTodo = {
    content: body.content,
    dueDate: body.dueDate,
    finished: body.finished,
  };

  return Todo.findByIdAndUpdate(id, updatedTodo, { new: true })
    .then((todo) => res.json(todo))
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }
  next(error);
};

app.use(errorHandler);

// listen on port
app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});
