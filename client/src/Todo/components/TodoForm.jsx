import React, { useState } from 'react';
import './../styles/TodoForm.css';

import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
  TextField: {
    width: 'calc(100vw - 136px)',
    maxWidth: '500px',
  },
  TextField__input: {
    textAlign: 'center',
  },
  KeyboardDatePicker: {
    width: 'calc(100vw - 136px)',
    maxWidth: '300px',
  },
  KeyboardDatePicker__input: {
    textAlign: 'center',
  },
});

const TodoTextFieldForm = (props) => {
  const classes = useStyles();

  const handleSubmit = (input, dueDate) => {
    if (input.length > 0) {
      console.log(input, dueDate);
      props.addTodo(input, dueDate);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    props.handleTodoFormInputChange(e.target.value);
  };

  const handleEnterPressed = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(props.todoForm.input, props.todoForm.dueDate);
    }
  };

  return (
    <form className="TodoInputForm" onSubmit={handleSubmit}>
      <TextField
        classes={{ root: classes.TextField }}
        margin="normal"
        type="text"
        name="todoTextField"
        placeholder="Enter Todo..."
        value={props.todoForm.input}
        onChange={handleInputChange}
        onKeyDown={handleEnterPressed}
        InputProps={{ classes: { input: classes.TextField__input } }}
        error={props.todoForm.error}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          // label="Due Date"
          format="M/dd"
          value={props.todoForm.dueDate}
          onChange={props.handleTodoFormDateChange}
          onKeyDown={handleEnterPressed}
          InputProps={{ classes: { input: classes.KeyboardDatePicker__input } }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
            'style': { display: 'none' },
          }}
        />
      </MuiPickersUtilsProvider>
    </form>
  );
};

export default TodoTextFieldForm;
