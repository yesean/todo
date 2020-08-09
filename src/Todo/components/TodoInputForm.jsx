import React from 'react';
import './../styles/TodoInputForm.css';

import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  TextField: {
    width: '33vw',
  },
  TextField__input: {
    textAlign: 'center',
  },
});

const TodoTextFieldForm = (props) => {
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.todoFormInput.input.length > 0) {
      props.addTodo();
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const nextInput = e.target.value;
    props.setTodoFormInput((oldTodoFormInput) => ({
      ...oldTodoFormInput,
      input: nextInput,
    }));
  };

  return (
    <form className="TodoInputForm" onSubmit={handleSubmit}>
      <TextField
        classes={{ root: classes.TextField }}
        type="text"
        name="todoTextField"
        placeholder="Enter Todo..."
        value={props.todoFormInput.input}
        onChange={handleChange}
        InputProps={{ classes: { input: classes.TextField__input } }}
        error={props.todoFormInput.error}
      />
    </form>
  );
};

export default TodoTextFieldForm;
