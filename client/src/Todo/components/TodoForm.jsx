import React from 'react';
import '../styles/TodoForm.css';

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
    fullWidth: true,
  },
  KeyboardDatePicker: {
    width: 'calc((100vw - 136px) / 4)',
    maxWidth: '250px',
  },
  KeyboardDatePicker__inputAdornment: {
    display: 'none',
  },
});

const TodoTextFieldForm = ({
  todoForm,
  addTodo,
  handleTodoFormInputChange,
  handleTodoFormDateChange,
}) => {
  const classes = useStyles();

  const handleSubmit = (input, dueDate, error) => {
    if (input.length > 0 && !error) {
      addTodo(input, dueDate);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    handleTodoFormInputChange(e.target.value);
  };

  const handleEnterPressed = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(todoForm.input, todoForm.dueDate, todoForm.error);
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
        value={todoForm.input}
        onChange={handleInputChange}
        onKeyDown={handleEnterPressed}
        InputProps={{ classes: { input: classes.TextField__input } }}
        error={todoForm.error}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          label="Due Date"
          format="MM/dd/yy"
          value={todoForm.dueDate}
          onChange={handleTodoFormDateChange}
          onKeyDown={handleEnterPressed}
          classes={{ root: classes.KeyboardDatePicker }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </form>
  );
};

export default TodoTextFieldForm;
