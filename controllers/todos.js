const todosRouter = require('express').Router();
const Todo = require('../models/todo');

// get all todos
todosRouter.get('/', (req, res) => {
  jwt.verify(req.token, privateKey, (error, decoded) => {
    if (error) {
      return res.sendStatus(403);
    }
    return Todo.find({}).then((todos) => res.json(todos));
  });
});

// get specific todo based on id
todosRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Todo.findById(id)
    .then((todo) => res.json(todo))
    .catch((error) => next(error));
});

// delete todo based on id
todosRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  return Todo.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});



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

  return todoToAdd.save().then((savedTodo) => {
    return res.json(savedTodo);
  });
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

  return Todo.findByIdAndUpdate(id, updatedTodo, { new: true })
    .then((todo) => res.json(todo))
    .catch((error) => next(error));
});

module.exports = todosRouter;
