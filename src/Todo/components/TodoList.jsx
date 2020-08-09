import React from 'react';
import './../styles/TodoList.css';
import {
  TextField,
  IconButton,
  Checkbox,
  makeStyles,
} from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';

const useStyles = makeStyles({
  Checkbox: {
    padding: 12,
  },
  TextField: {
    width: 'calc(90vw - 136px)',
    maxWidth: '500px',
    margin: 0,
  },
  TextField__input: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const TodoList = (props) => {
  const classes = useStyles();

  const handleEditTodo = (e, todo) => {
    e.stopPropagation();
    props.editTodo(todo, e.target.value);
  };

  const handleToggleTodo = (e, todo) => {
    props.toggleTodo(todo);
  };

  const handleSubmitTodo = (e) => {
    e.preventDefault();
    document.activeElement.blur();
  };

  const handleDeleteTodo = (e, todo) => {
    e.stopPropagation();
    props.removeTodo(todo);
  };

  return (
    <ul className="TodoList">
      {props.todoList.map((todo) => (
        <li
          key={todo.dateCreated}
          className={clsx(
            'TodoList__li',
            todo.finished && 'TodoList__li--finished'
          )}
          onClick={(e) => handleToggleTodo(e, todo)}
        >
          <Checkbox
            id={todo.todo}
            classes={{ root: classes.Checkbox }}
            name="todo"
            color="primary"
            checked={todo.finished}
          />
          <form onSubmit={handleSubmitTodo}>
            <TextField
              type="text"
              classes={{ root: classes.TextField }}
              value={todo.todo}
              onChange={(e) => handleEditTodo(e, todo)}
              onClick={(e) => e.stopPropagation()}
              InputProps={{
                disableUnderline: !todo.duplicate,
                classes: { input: classes.TextField__input },
              }}
              error={todo.duplicate}
            />
          </form>
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={(e) => handleDeleteTodo(e, todo)}
          >
            <DeleteIcon />
          </IconButton>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
