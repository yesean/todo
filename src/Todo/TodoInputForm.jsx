import React, { useState } from 'react';
import './../styles/TodoInputForm.css';

import { Input, Button } from '@material-ui/core';
// import 'fontsource-roboto';

const TodoInputForm = (props) => {
  const [todoInput, setTodoInputForm] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setTodoInputForm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoInput.length > 0) {
      props.addTodo({todo: todoInput, finished: false});
      setTodoInputForm('');
    }
  };

  return (
    <form className="TodoInputForm" onSubmit={handleSubmit}>
      <Input
        className="TodoInputForm__input"
        type="text"
        name="todoInput"
        placeholder="Enter Todo"
        value={todoInput}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary" disableElevation>
        Enter
      </Button>
    </form>
  );
};

export default TodoInputForm;
