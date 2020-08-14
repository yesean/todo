/* eslint-disable no-prototype-builtins */
const { formatISO, isValid, parseISO, toDate } = require('date-fns');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

let todos = [
  {
    content: 'brush teeth',
    dueDate: formatISO(new Date(2020, 7, 1)),
    createdDate: formatISO(new Date(2020, 7, 1)),
    finished: false,
    duplicate: false,
    id: `brush teeth${formatISO(new Date(2020, 7, 1))}`,
  },
  {
    content: 'grind code',
    dueDate: formatISO(new Date(2020, 7, 2)),
    createdDate: formatISO(new Date(2020, 7, 2)),
    finished: false,
    duplicate: false,
    id: `grind code${formatISO(new Date(2020, 7, 2))}`,
  },
  {
    content: 'sleep',
    dueDate: formatISO(new Date(2020, 7, 3)),
    createdDate: formatISO(new Date(2020, 7, 3)),
    finished: false,
    duplicate: false,
    id: `sleep${formatISO(new Date(2020, 7, 3))}`,
  },
];

// home page
app.get('/', (req, res) => {
  res.send('<p>this is the server for todo!</p>');
});

// get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// get specific todo based on id
app.get('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todoToGet = todos.find((todo) => todo.id === id);

  if (todoToGet) {
    res.json(todoToGet);
  } else {
    res.sendStatus(404);
  }
});

// insert new todo
app.post('/api/todos/', (req, res) => {
  const { body } = req;

  // missing content
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  // missing dueDate
  if (!body.dueDate) {
    return res.status(400).json({ error: 'dueDate missing' });
  }

  // incorrectly formatted dueDate
  if (!isValid(parseISO(body.dueDate))) {
    return res
      .status(400)
      .json({ error: 'invalid dueDate format, dueDate must be in ISO format' });
  }

  // incorrectly formatted finished
  if (body.finished && typeof body.finished !== 'boolean') {
    return res
      .status(400)
      .json({ error: 'invalid finished format, finished must be a boolean' });
  }

  // duplicate todo
  if (
    todos.some(
      (todo) => todo.id === `${body.content}${toDate(parseISO(body.dueDate))}`
    )
  ) {
    return res.status(400).json({ error: 'invalid todo, todo already exists' });
  }

  const createdDate = formatISO(new Date());
  const todoToAdd = {
    content: body.content,
    dueDate: body.dueDate,
    createdDate,
    finished: body.finished || false,
    duplicate: false,
    id: `${body.content}${createdDate}`,
  };

  todos = [...todos, todoToAdd];
  return res.json(todoToAdd);
});

// update existing todo
app.put('/api/todos/:id', (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const allowedKeys = new Set([
    'content',
    'dueDate',
    'createdDate',
    'finished',
    'duplicate',
    'id',
  ]);

  // keys don't exist
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) {
    return res.status(400).json({
      error: 'only content, dueDate, or finished can be modified',
    });
  }

  // id doesn't exist
  if (!todos.some((todo) => todo.id === id)) {
    return res.status(400).json({
      error: 'no todo with specified id found',
    });
  }

  // invalid date format
  if (body.date && isValid(parseISO(body.dueDate))) {
    return res.status(400).json({
      error: 'dueDate must be in ISO format',
    });
  }

  // invalid finished format
  if (body.hasOwnProperty('finished') && typeof body.finished !== 'boolean') {
    return res.status(400).json({
      error: 'finished must be a boolean',
    });
  }

  const updatedTodo = {
    content: body.content,
    dueDate: body.dueDate,
    createdDate: body.createdDate,
    finished: body.finished,
    duplicate: body.duplicate,
    id: `${body.content}${body.createdDate}`,
  };

  const index = todos.findIndex((todo) => todo.id === id);
  todos[index] = updatedTodo;
  return res.json(todos[index]);
});

// delete todo based on id
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todoToDelete = todos.find((todo) => todo.id === id);

  if (todoToDelete) {
    todos = todos.filter((todo) => todo !== todoToDelete);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

// listen on port
app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});
