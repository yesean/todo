/* eslint-disable no-underscore-dangle */
const Todo = require('../models/todo');

const initialTodos = [
  {
    content: 'study for test',
    dueDate: '2020-08-27T06:59:59.999Z',
    finished: false,
  },
  {
    content: 'buy groceries',
    dueDate: '2020-08-20T06:59:59.999Z',
    finished: false,
  },
];

const nonExistingId = async () => {
  const todo = new Todo({
    content: 'will remove this soon',
    dueDate: new Date(),
  });

  await todo.save();
  await todo.remove();

  return todo._id.toString();
};

const todosInDb = async () => {
  const todos = await Todo.find({});
  return todos.map((todo) => todo.toJSON());
};

module.exports = { initialTodos, nonExistingId, todosInDb };
