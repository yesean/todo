import React from 'react';
import './../styles/TodoList.css';
import {
  FormControlLabel,
  IconButton,
  Checkbox,
  makeStyles,
} from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';

const useStyles = makeStyles({
  checkbox: {
    padding: 12,
  },
  label: {
    margin: 5,
  },
});

const TodoList = (props) => {
  const classes = useStyles();

  return (
    <ul className="TodoList">
      {props.todoList.map((todo) => (
        <li
          key={todo.todo}
          className={clsx(
            'TodoList__li',
            todo.finished && 'TodoList__li--finished'
          )}
          onClick={() => props.finishTodo(todo)}
        >
          <FormControlLabel
            control={
              <Checkbox
                id={todo.todo}
                classes={{ root: classes.checkbox }}
                name="todo"
                color="primary"
                checked={todo.finished}
              />
            }
            label={todo.todo}
            classes={{root: classes.label}}
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
