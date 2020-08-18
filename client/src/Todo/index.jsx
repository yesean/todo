import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatISO, parseISO, compareAsc } from 'date-fns';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';

import TodoList from './components/TodoList';
import TodoInputForm from './components/TodoForm';
import './styles/index.css';

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

const server = 'http://localhost:3001';

const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoForm, setTodoForm] = useState({
    input: '',
    dueDate: new Date(),
    error: false,
  });

  useEffect(() => {
    axios.get(`${server}/api/todos`).then((res) => {
      setTodoList(sortTodoList(res.data));
    });
  }, []);

  // clear duplicate warnings
  const unsetDuplicateTodos = () => {
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) => ({ ...todo, duplicate: false }))
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
    setTodoList((prevTodoList) => {
      const nextTodoList = [...prevTodoList];
      const duplicateTodo = nextTodoList.find(
        (todo) => todo.id !== id && todo.content === content
      );
      duplicateTodo.duplicate = true;
      return [...nextTodoList];
    });
  };

  // sort todoList by finished and dueDate
  const sortTodoList = (prevTodoList) => {
    const finishedTodoList = prevTodoList
      .filter((todo) => todo.finished)
      .sort(
        (a, b) =>
          compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)) ||
          compareAsc(parseISO(a.createdDate), parseISO(b.createdDate))
      );
    const unfinishedTodoList = prevTodoList
      .filter((todo) => !todo.finished)
      .sort(
        (a, b) =>
          compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)) ||
          compareAsc(parseISO(a.createdDate), parseISO(b.createdDate))
      );
    return [...finishedTodoList, ...unfinishedTodoList];
  };

  // add new todo from form input
  const addTodo = (input, dueDate) => {
    const newTodo = {
      content: input,
      dueDate: formatISO(dueDate),
      finished: false,
    };
    axios.post(`${server}/api/todos/`, newTodo).then((res) => {
      setTodoList((prevTodoList) => sortTodoList([...prevTodoList, res.data]));
      setTodoForm({
        input: '',
        dueDate: new Date(),
        error: false,
      });
    });
  };

  // edit existing todo
  const editTodoContent = (todoToEdit, content) => {
    unsetDuplicateTodos();
    setTodoList((prevTodoList) => {
      const nextTodoList = [...prevTodoList];
      nextTodoList.find((todo) => todo.id === todoToEdit.id).content = content;
      return [...prevTodoList];
    });
    if (hasDuplicateTodo(content, todoToEdit.id)) {
      setDuplicateTodo(content, todoToEdit.id);
      setTodoList((prevTodoList) => {
        const nextTodoList = [...prevTodoList];
        nextTodoList.find((todo) => todo.id === todoToEdit.id).duplicate = true;
        return [...prevTodoList];
      });
    }
  };

  // update existing todo
  const updateTodo = (id) => {
    return axios
      .put(
        `${server}/api/todos/${id}`,
        todoList.find((todo) => todo.id === id)
      )
      .then((res) => Promise.resolve('Success'))
      .catch(() => Promise.resolve('Failure'));
  };

  // toggle todo between finished and unfinished state
  const toggleTodo = (id, finished) => {
    const todoToToggle = {
      ...todoList.find((todo) => todo.id === id),
      finished: !finished,
    };
    axios
      .put(`${server}/api/todos/${id}`, todoToToggle)
      .then((res) => {
        const nextTodoList = [...todoList];
        nextTodoList[nextTodoList.findIndex((todo) => todo.id === id)] =
          res.data;
        setTodoList(sortTodoList(nextTodoList));
      })
      .catch(console.log);
  };

  // remove todo from list
  const deleteTodo = (todoToDelete) => {
    axios.delete(`${server}/api/todos/${todoToDelete.id}`).then((res) => {
      setTodoList((prevTodoList) =>
        prevTodoList.filter((todo) => todo.id !== todoToDelete.id)
      );
    });
  };

  // handle form input
  const handleTodoFormInputChange = (input) => {
    unsetDuplicateTodos();
    setTodoForm((form) => ({ ...form, input }));
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
      dueDate,
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
          editTodoContent={editTodoContent}
          updateTodo={updateTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
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
