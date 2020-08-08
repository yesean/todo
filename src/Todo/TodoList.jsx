import React from 'react';
import './../styles/TodoList.css';
import { FormControlLabel, IconButton, Checkbox } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';

const TodoList = (props) => {
  return (
    <ul className="TodoList">
      {props.todoList.map((todo) => (
        <li
          key={todo.todo}
          className={todo.finished ? 'TodoList__li--finished' : 'TodoList__li'}
        >
          <FormControlLabel
            control={
              <Checkbox
                id={todo.todo}
                name="todo"
                color="primary"
                onChange={() => props.finishTodo(todo)}
              />
            }
            label={todo.todo}
          />
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => props.removeTodo(todo)}
          >
            <DeleteIcon />
          </IconButton>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
