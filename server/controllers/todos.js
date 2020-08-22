const todosRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const User = require('../models/user');
const middleware = require('../utils/middleware');
const config = require('../utils/config');

// get all todos
todosRouter.get('/', async (req, res) => {
  const todos = await Todo.find({}).populate('user', { username: 1 });
  return res.json(todos);
});

// get specific todo based on id
todosRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).end();
  }
});

// delete todo based on id
todosRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  await Todo.findByIdAndDelete(id);
  res.status(204).end();
});

todosRouter.use(middleware.verifyTodo);

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// insert new todo
todosRouter.post('/', async (req, res) => {
  const { body } = req;
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, config.SECRET_KEY);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

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
    user: user._id,
  });

  const savedTodo = await todoToAdd.save();
  user.todos = [...user.todos, savedTodo._id];
  await user.save();

  res.json(savedTodo);
});

// update existing todo
todosRouter.put('/:id', async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, config.SECRET_KEY);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const processedUser = JSON.parse(JSON.stringify(user));

  if (processedUser.id !== decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const updatedTodo = {
    content: body.content,
    dueDate: body.dueDate,
    finished: body.finished,
  };

  const todo = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true });
  return res.json(todo);
});

module.exports = todosRouter;
