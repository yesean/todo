const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Todo = require('../models/todo');
const {
  initialTodos,
  nonExistingId,
  todosInDb,
} = require('./todo_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Todo.deleteMany({});

  const todos = initialTodos.map((todo) => new Todo(todo));
  const promiseArray = todos.map((todo) => todo.save());
  await Promise.all(promiseArray);
});

describe('when there is initially some todos saved', () => {
  test('todos are returned as json', async () => {
    await api
      .get('/api/todos')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all todos are returned', async () => {
    const res = await api.get('/api/todos');
    expect(res.body).toHaveLength(initialTodos.length);
  });

  test('a specific todo is within the returned todos', async () => {
    const res = await api.get('/api/todos');
    const contents = res.body.map((todo) => todo.content);
    expect(contents).toContain(initialTodos[1].content);
  });
});

describe('viewing a specific todo', () => {
  test('succeeds with a valid id', async () => {
    const todosAtStart = await todosInDb();
    const todoToView = todosAtStart[0];
    const resultTodo = await api
      .get(`/api/todos/${todoToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedTodoToView = JSON.parse(JSON.stringify(todoToView));
    expect(resultTodo.body).toEqual(processedTodoToView);
  });

  test('fails with statuscode 404 if todo does not exist', async () => {
    const validNonexistingId = await nonExistingId();
    await api.get(`/api/todos/${validNonexistingId}`).expect(404);
  });
});

describe('addition of new note', () => {
  test('succeeds with valid data', async () => {
    const newTodo = {
      content: 'get breakfast',
      dueDate: new Date(),
    };
    await api
      .post('/api/todos')
      .send(newTodo)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const todosAtEnd = await todosInDb();
    expect(todosAtEnd).toHaveLength(initialTodos.length + 1);

    const contents = todosAtEnd.map((todo) => todo.content);
    expect(contents).toContain(newTodo.content);
  });

  test('fails with status code 400 if data is invalid', async () => {
    const newTodo = {
      dueDate: new Date(),
    };

    await api.post('/api/todos').send(newTodo).expect(400);
    const todosAtEnd = await todosInDb();
    expect(todosAtEnd).toHaveLength(initialTodos.length);
  });
});

describe('deletion of note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const todosAtStart = await todosInDb();
    const todoToDelete = await todosAtStart[0];

    await api.delete(`/api/todos/${todoToDelete.id}`).expect(204);

    const todosAtEnd = await todosInDb();

    expect(todosAtEnd).toHaveLength(initialTodos.length - 1);
    const contents = todosAtEnd.map((todo) => todo.content);
    expect(contents).not.toContain(todoToDelete);
  });

  test('fails with status code 204 if id is invalid', async () => {
    const nonExistingTodoId = await nonExistingId();
    await api.delete(`/api/todos/${nonExistingTodoId}`).expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
