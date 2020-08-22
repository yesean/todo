import React, { useState, useEffect } from 'react';
import { endOfDay, isEqual, compareAsc, parseJSON } from 'date-fns';
import { Container, Grid, Button } from '@material-ui/core';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './styles/index.css';
import todoService from '../services/todo';

const Todo = ({ user, setUser }) => {
  const [todoList, setTodoList] = useState([]);
  const [todoForm, setTodoForm] = useState({
    content: '',
    dueDate: endOfDay(new Date()),
    error: false,
  });

  // initially fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await todoService.getAll();
      setTodoList(
        sortTodoList(
          parseDates(todos.filter((t) => t.user.username === user.username))
        )
      );
    };
    if (user) {
      fetchTodos();
    }
  }, [user]);

  // deserialize dates
  const parseDates = (todos) => {
    return todos.map((todo) => ({
      ...todo,
      dueDate: parseJSON(todo.dueDate),
      createdDate: parseJSON(todo.createdDate),
    }));
  };

  // check if a todo is a duplicate of another
  const isDuplicateTodo = (todo, otherTodo) => {
    return (
      todo.id !== otherTodo.id &&
      todo.content === otherTodo.content &&
      isEqual(todo.dueDate, otherTodo.dueDate)
    );
  };

  // checks for existing duplicate todos
  const hasDuplicateTodo = (todo) => {
    return todoList.some((otherTodo) => isDuplicateTodo(todo, otherTodo));
  };

  // mark an existing todo as a duplicate
  const getDuplicateTodo = (todo) => {
    return todoList.findIndex((otherTodo) => isDuplicateTodo(todo, otherTodo));
  };

  // sort todoList by finished and dueDate
  const sortTodoList = (prevTodoList) => {
    const finishedTodoList = prevTodoList
      .filter((todo) => todo.finished)
      .sort(
        (a, b) =>
          compareAsc(a.dueDate, b.dueDate) ||
          compareAsc(a.createdDate, b.createdDate)
      );
    const unfinishedTodoList = prevTodoList
      .filter((todo) => !todo.finished)
      .sort(
        (a, b) =>
          compareAsc(a.dueDate, b.dueDate) ||
          compareAsc(a.createdDate, b.createdDate)
      );
    return [...finishedTodoList, ...unfinishedTodoList];
  };

  // mark duplicate todos
  const markDuplicateTodos = () => {
    setTodoList((prevTodoList) => {
      const nextTodoList = [...prevTodoList];
      const dupTodo = nextTodoList.findIndex(
        (todo) =>
          isDuplicateTodo(todo, { ...todoForm, id: -1 }) ||
          nextTodoList.some((otherTodo) => isDuplicateTodo(todo, otherTodo))
      );
      if (dupTodo !== -1) {
        const otherDupTodo = nextTodoList.findIndex((todo) =>
          isDuplicateTodo(todo, nextTodoList[dupTodo])
        );
        nextTodoList[dupTodo].duplicate = true;
        if (otherDupTodo === -1) {
          setTodoForm((prevTodoForm) => ({ ...prevTodoForm, error: true }));
        } else {
          nextTodoList[otherDupTodo].duplicate = true;
        }
      }
      return nextTodoList;
    });
  };

  // remove todo from list
  const deleteTodo = async (todoToDelete) => {
    try {
      await todoService.remove(todoToDelete);
      unsetDuplicates();
      setTodoList((prevTodoList) =>
        prevTodoList.filter((todo) => todo.id !== todoToDelete.id)
      );
      markDuplicateTodos();
    } catch (error) {
      setUser(null);
      console.error(error.response);
    }
  };

  // add new todo from form content
  const addTodo = async (props) => {
    const newTodo = {
      ...props,
      finished: false,
    };

    try {
      const savedTodo = await todoService.create(newTodo);
      setTodoList((prevTodoList) =>
        sortTodoList(parseDates([...prevTodoList, savedTodo]))
      );
      resetTodoForm();
    } catch (error) {
      console.error(error.response);
      setUser(null);
    }
  };

  // update existing todo
  const updateTodo = async (newTodo) => {
    try {
      const savedTodo = await todoService.update(newTodo);
      setTodoList((prevTodoList) => {
        const nextTodoList = prevTodoList.map((t) =>
          t.id === savedTodo.id ? savedTodo : t
        );
        return sortTodoList(parseDates(nextTodoList));
      });
      return Promise.resolve('success');
    } catch (error) {
      console.error(error.response);
      setUser(null);
      return Promise.reject(error);
    }
  };

  // set all todos as non duplicates
  const unsetDuplicates = () => {
    setTodoList((prevTodoList) =>
      prevTodoList.map((t) => ({ ...t, duplicate: false }))
    );
    setTodoForm((prevTodoForm) => ({
      ...prevTodoForm,
      error: false,
    }));
  };

  // handle todo change
  const handleTodoChange = (id, nextProps) => {
    unsetDuplicates();
    setTodoList((prevTodoList) => {
      const nextTodoList = [...prevTodoList];
      const index = nextTodoList.findIndex((t) => t.id === id);
      const todo = { ...nextTodoList[index], ...nextProps };
      nextTodoList[index] = { ...todo };
      if (hasDuplicateTodo(todo)) {
        const otherIndex = getDuplicateTodo(todo);
        nextTodoList[otherIndex].duplicate = true;
        nextTodoList[index].duplicate = true;
      }
      return nextTodoList;
    });
  };

  // handle form change
  const handleTodoFormChange = async (nextProps) => {
    unsetDuplicates();
    let todo;
    await setTodoForm((prevTodoForm) => {
      let nextTodoForm = { ...prevTodoForm, ...nextProps };
      todo = { ...nextTodoForm, id: -1 };
      if (hasDuplicateTodo(todo)) {
        nextTodoForm = { ...nextTodoForm, error: true };
      }
      return nextTodoForm;
    });
    if (hasDuplicateTodo(todo)) {
      const otherIndex = getDuplicateTodo(todo);
      setTodoList((prevTodoList) =>
        prevTodoList.map((t, index) =>
          index === otherIndex ? { ...t, duplicate: true } : t
        )
      );
    }
  };

  const resetTodoForm = () => {
    setTodoForm({
      content: '',
      dueDate: endOfDay(new Date()),
      error: false,
    });
  };

  return (
    <div className="Todo">
      <Container>
        <TodoList
          todoList={todoList}
          handleTodoChange={handleTodoChange}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
        <TodoForm
          addTodo={addTodo}
          todoForm={todoForm}
          handleTodoFormChange={handleTodoFormChange}
        />
        <Grid container justify="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              window.localStorage.removeItem('loggedInTodoAppUser');
              setUser(null);
            }}
          >
            Log Out
          </Button>
        </Grid>
      </Container>
    </div>
  );
};

export default Todo;
