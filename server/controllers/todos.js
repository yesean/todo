const todosRouter = require('express').Router();
const Todo = require('../models/todo');
const middleware = require('../utils/middleware');

// get all todos
todosRouter.get('/', async (req, res) => {
  const todos = await Todo.find({});
  return res.json(todos);
});

// get specific todo based on id
todosRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    return next(error);
  }
});

// delete todo based on id
todosRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

todosRouter.use(middleware.verifyTodo);

// insert new todo
todosRouter.post('/', async (req, res) => {
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

  const todo = await todoToAdd.save();
  return res.json(todo);
});

// update existing todo
todosRouter.put('/:id', async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const updatedTodo = {
    content: body.content,
    dueDate: body.dueDate,
    finished: body.finished,
  };

  try {
    const todo = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true });
    return todo;
  } catch (error) {
    next(error);
  }
});

module.exports = todosRouter;
