import React, { useState } from 'react';
import './styles/index.css';
import TodoList from './components/TodoList';
import TodoInputForm from './components/TodoForm';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import { format, compareAsc } from 'date-fns';

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
    content: 'wash feet',
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `wash feet ${new Date()}`,
  },
  {
    content: 'drink dew',
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `drink dew ${new Date()}`,
  },
  {
    content: 'eat blaze',
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `eat blaze ${new Date()}`,
  },
];

const Todo = () => {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [todoForm, setTodoForm] = useState({
    input: '',
    dueDate: new Date(),
    error: false,
  });

  // clear duplicate warnings
  const unsetDuplicateTodos = () => {
    setTodoList((oldTodoList) =>
      oldTodoList.map((todo) => ({ ...todo, duplicate: false }))
    );
    setTodoForm((form) => ({
      ...form,
      error: false,
    }));
  };

  // checks for existing duplicate todos
  const hasDuplicateTodo = (content, id) => {
    return todoList.some(
      (possibleDuplicateTodo) =>
        possibleDuplicateTodo.id !== id &&
        possibleDuplicateTodo.content === content
    );
  };

  // mark an existing todo as a duplicate
  const setDuplicateTodo = (content, id) => {
    setTodoList((oldTodoList) => {
      const duplicateTodo = oldTodoList.find(
        (duplicateTodo) =>
          duplicateTodo.id !== id && duplicateTodo.content === content
      );
      duplicateTodo.duplicate = true;
      return [...oldTodoList];
    });
  };

  // add new todo from form input
  const addTodo = (input, dueDate) => {
    if (!todoList.some((todo) => todo.content === todoForm.input)) {
      const newTodo = {
        content: input,
        dueDate: dueDate,
        finished: false,
        id: `${input}${dueDate}`,
      };
      setTodoList((oldTodoList) => [...oldTodoList, newTodo]);
      setTodoForm({
        input: '',
        dueDate: new Date(),
        error: false,
      });
    }
  };

  // edit existing todo
  const editTodo = (todoToEdit, content) => {
    unsetDuplicateTodos();
    setTodoList((oldTodoList) => {
      oldTodoList.find((todo) => todo.id === todoToEdit.id).content = content;
      return [...oldTodoList];
    });
    if (hasDuplicateTodo(content, todoToEdit.id)) {
      setDuplicateTodo(content, todoToEdit.id);
      setTodoList((oldTodoList) => {
        oldTodoList.find((todo) => todo.id === todoToEdit.id).duplicate = true;
        return [...oldTodoList];
      });
    }
  };

  // toggle todo between finished and unfinished state
  const toggleTodo = (todoToToggle) => {
    todoToToggle.finished = !todoToToggle.finished;
    const finishedTodoList = todoList
      .filter((todo) => todo.finished)
      .sort((a, b) => compareAsc(a, b) || a.id - b.id);
    const unfinishedTodoList = todoList
      .filter((todo) => !todo.finished)
      .sort((a, b) => compareAsc(a, b) || a.id - b.id);
    setTodoList([...finishedTodoList, ...unfinishedTodoList]);
  };

  // remove todo from list
  const removeTodo = (todoToDelete) => {
    setTodoList((oldTodoList) =>
      oldTodoList.filter((todo) => todo !== todoToDelete)
    );
  };

  // handle form input
  const handleTodoFormInputChange = (input) => {
    unsetDuplicateTodos();
    setTodoForm((form) => ({ ...form, input: input }));
    if (hasDuplicateTodo(input, Date.now())) {
      setDuplicateTodo(input, Date.now());
      setTodoForm((oldTodoForm) => ({
        ...oldTodoForm,
        error: true,
      }));
    }
  };

  // handle form date
  const handleTodoFormDateChange = (dueDate) => {
    setTodoForm((oldTodoForm) => ({
      ...oldTodoForm,
      dueDate: dueDate,
    }));
  };

  const disablePageOnError = (e) => {
    if (todoList.some((todo) => todo.duplicate)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className="Todo"
      onMouseDown={disablePageOnError}
      onClickCapture={disablePageOnError}
    >
      <ThemeProvider theme={theme}>
        <TodoList
          todoList={todoList}
          editTodo={editTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
        <TodoInputForm
          addTodo={addTodo}
          todoForm={todoForm}
          handleTodoFormInputChange={handleTodoFormInputChange}
          handleTodoFormDateChange={handleTodoFormDateChange}
        />
      </ThemeProvider>
    </div>
  );
};

export default Todo;
