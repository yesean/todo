import React, { useState } from 'react';
import './styles/index.css'
import TodoList from './components/TodoList';
import TodoInputForm from './components/TodoInputForm';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import { useEffect } from 'react';
import { useCallback } from 'react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[400],
    },
    secondary: {
      main: red[400],
    },
  },
});

const initialTodoList = [
  {
    todo: 'wash feet',
    finished: false,
    duplicate: false,
    dateCreated: Date.now(),
  },
  {
    todo: 'drink dew',
    finished: false,
    duplicate: false,
    dateCreated: Date.now() + 1,
  },
  {
    todo: 'eat blaze',
    finished: false,
    duplicate: false,
    dateCreated: Date.now() + 2,
  },
];

const Todo = () => {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [todoFormInput, setTodoFormInput] = useState({
    input: '',
    error: false,
  });

  const toggleDuplicateTodos = useCallback(() => {
    if (todoList.some((todo) => todo.duplicate)) {
      // unset past duplicate

      const duplicateTodo = todoList.find((todo) => todo.duplicate);
      if (duplicateTodo.todo !== todoFormInput.input) {
        duplicateTodo.duplicate = false;
        setTodoList([...todoList]);
        setTodoFormInput((oldTodoFormInput) => ({
          ...oldTodoFormInput,
          error: false,
        }));
      }
    } else if (todoList.some((todo) => todo.todo === todoFormInput.input)) {
      // set curr duplicate

      const duplicateTodo = todoList.find(
        (todo) => todo.todo === todoFormInput.input
      );
      duplicateTodo.duplicate = true;
      setTodoList([...todoList]);
      setTodoFormInput((oldTodoFormInput) => ({
        ...oldTodoFormInput,
        error: true,
      }));
    }
  }, [todoList, setTodoList, todoFormInput]);

  useEffect(() => {
    toggleDuplicateTodos();
  }, [toggleDuplicateTodos, todoFormInput]);

  const addTodo = () => {
    if (!todoList.some((todo) => todo.todo === todoFormInput.input)) {
      const newTodo = {
        todo: todoFormInput.input,
        finished: false,
        dateCreated: Date.now(),
      };
      setTodoList((oldTodoList) => [...oldTodoList, newTodo]);
      setTodoFormInput({
        input: '',
        error: false,
      });
    }
  };

  const editTodo = (todoToEdit, edit) => {
    if (todoList.some(todo => todo !== todoToEdit && todo.todo === todoToEdit.todo)) {
      const duplicateTodo = todoList.find()
    }
    todoToEdit.todo = edit;
    setTodoList([...todoList]);
  };

  const toggleTodo = (todoToToggle) => {
    todoToToggle.finished = !todoToToggle.finished;
    const finishedTodoList = todoList
      .filter((todo) => todo.finished)
      .sort((a, b) => a.dateCreated - b.dateCreated);
    const unfinishedTodoList = todoList
      .filter((todo) => !todo.finished)
      .sort((a, b) => a.dateCreated - b.dateCreated);
    console.log(unfinishedTodoList.map((x) => x.dateCreated));
    console.log(JSON.stringify(unfinishedTodoList));
    setTodoList([...finishedTodoList, ...unfinishedTodoList]);
  };

  const removeTodo = (todoToDelete) => {
    setTodoList((oldTodoList) =>
      oldTodoList.filter((todo) => todo !== todoToDelete)
    );
  };

  return (
    <div className="Todo">
      <ThemeProvider theme={theme}>
        <TodoList
          todoList={todoList}
          editTodo={editTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
        <TodoInputForm
          addTodo={addTodo}
          todoFormInput={todoFormInput}
          setTodoFormInput={setTodoFormInput}
        />
      </ThemeProvider>
    </div>
  );
};

export default Todo;
