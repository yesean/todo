import React, { useState } from 'react';
import './../styles/TodoInputForm.css';

import { Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  input: {
    textAlign: 'center',
  },
});

const TodoInputForm = (props) => {
  const classes = useStyles();
  const [todoInput, setTodoInputForm] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setTodoInputForm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoInput.length > 0) {
      props.addTodo({ todo: todoInput, finished: false });
      setTodoInputForm('');
    }
  };

  return (
    <form className="TodoInputForm" onSubmit={handleSubmit}>
      <Input
        classes={{ input: classes.input }}
        type="text"
        name="todoInput"
        placeholder="Enter Todo"
        value={todoInput}
        onChange={handleChange}
      />
    </form>
  );
};

export default TodoInputForm;
