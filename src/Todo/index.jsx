import React, { useState } from 'react';
import TodoList from './TodoList';
import TodoInputForm from './TodoInputForm';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';

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
  { todo: 'wash feet', finished: false },
  { todo: 'drink dew', finished: false },
  { todo: 'eat blaze', finished: false },
];

const Todo = () => {
  const [todoList, setTodoList] = useState(initialTodoList);

  const addTodo = (newTodo) => {
    if (!todoList.map((todo) => todo.todo).includes(newTodo.todo)) {
      setTodoList((oldTodoList) => [...oldTodoList, newTodo]);
    }
  };

  const finishTodo = (finishedTodo) => {
    finishedTodo.finished = !finishedTodo.finished;
    const finishedTodoList = todoList.filter((todo) => todo.finished);
    const unfinishedTodoList = todoList.filter((todo) => !todo.finished);
    setTodoList([...finishedTodoList, ...unfinishedTodoList]);
  };

  const removeTodo = (todoToDelete) => {
    setTodoList((oldTodoList) =>
      oldTodoList.filter((todo) => todo !== todoToDelete)
    );
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <TodoList
          todoList={todoList}
          finishTodo={finishTodo}
          removeTodo={removeTodo}
        />
        <TodoInputForm addTodo={addTodo} />
      </ThemeProvider>
    </div>
  );
};

export default Todo;
