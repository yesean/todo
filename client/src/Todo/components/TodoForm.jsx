import React from 'react';
import '../styles/TodoForm.css';

import { TextField, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { endOfDay } from 'date-fns';
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
    width: 'calc((100vw - 136px) / 2)',
    maxWidth: '250px',
    minWidth: 150,
  },
  KeyboardDatePicker__inputAdornment: {
    display: 'none',
  },
});

const TodoTextFieldForm = ({ todoForm, addTodo, handleTodoFormChange }) => {
  const classes = useStyles();

  const handleSubmit = (content, dueDate, error) => {
    if (content.length > 0 && !error) {
      addTodo({ content, dueDate });
    }
  };

  const handleInputChange = (e) => {
    handleTodoFormChange({ content: e.target.value });
  };

  const handleDueDateChange = (e) => {
    handleTodoFormChange({ dueDate: endOfDay(e) });
  };

  const handleEnterPressed = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(todoForm.content, todoForm.dueDate, todoForm.error);
    }
  };

  return (
    <form className="TodoInputForm" onSubmit={handleSubmit}>
      <FormControl error={todoForm.error}>
        <TextField
          classes={{ root: classes.TextField }}
          margin="normal"
          type="text"
          name="todoTextField"
          placeholder="Enter Todo..."
          value={todoForm.content}
          onChange={handleInputChange}
          onKeyDown={handleEnterPressed}
          InputProps={{ classes: { input: classes.TextField__input } }}
          inputProps={{ className: 'TodoForm__input' }}
          error={todoForm.error}
          helperText={todoForm.error && 'Duplicate todo'}
        />
      </FormControl>
      <FormControl error={todoForm.error}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            label="Due Date"
            format="MM/dd/yy"
            value={todoForm.dueDate}
            error={todoForm.error}
            onChange={handleDueDateChange}
            onKeyDown={handleEnterPressed}
            classes={{ root: classes.KeyboardDatePicker }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            inputProps={{ className: 'TodoForm__input' }}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    </form>
  );
};

export default TodoTextFieldForm;
