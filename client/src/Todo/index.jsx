import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { endOfDay, isEqual, compareAsc, parseJSON } from 'date-fns';
import { Container } from '@material-ui/core';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './styles/index.css';

const server = 'http://localhost:3001';

const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoForm, setTodoForm] = useState({
    content: '',
    dueDate: endOfDay(new Date()),
    error: false,
  });

  // initially fetch todos
  useEffect(() => {
    axios.get(`${server}/api/todos`).then((res) => {
      let nextTodoList = parseDates(res.data);
      nextTodoList = sortTodoList(nextTodoList);
      setTodoList(nextTodoList);
    });
  }, []);

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

  // remove todo from list
  const deleteTodo = (todoToDelete) => {
    axios.delete(`${server}/api/todos/${todoToDelete.id}`).then((res) => {
      unsetDuplicates();
      setTodoList((prevTodoList) =>
        prevTodoList.filter((todo) => todo.id !== todoToDelete.id)
      );
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
    });
  };

  // add new todo from form content
  const addTodo = (props) => {
    const newTodo = {
      ...props,
      finished: false,
    };
    axios
      .post(`${server}/api/todos/`, newTodo)
      .then((res) => {
        setTodoList((prevTodoList) =>
          sortTodoList(parseDates([...prevTodoList, res.data]))
        );
        setTodoForm({
          content: '',
          dueDate: endOfDay(new Date()),
          error: false,
        });
      })
      .catch((error) => console.log(error.response));
  };

  // update existing todo
  const updateTodo = (id, nextProps) => {
    const todoToUpdate = {
      ...todoList.find((todo) => todo.id === id),
      ...nextProps,
    };
    return axios
      .put(`${server}/api/todos/${id}`, todoToUpdate)
      .then((res) => {
        setTodoList((prevTodoList) => {
          const nextTodoList = [...prevTodoList];
          const index = nextTodoList.findIndex((todo) => todo.id === id);
          nextTodoList[index] = res.data;
          return sortTodoList(parseDates(nextTodoList));
        });
        return Promise.resolve('success');
      })
      .catch((error) => {
        console.log(error.response);
        Promise.reject(error.response);
      });
  };

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
      </Container>
    </div>
  );
};

export default Todo;
