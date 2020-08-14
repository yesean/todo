import React from 'react';
import '../styles/TodoList.css';
import {
  TextField,
  IconButton,
  Checkbox,
  Tooltip,
  makeStyles,
} from '@material-ui/core/';
import { Delete as DeleteIcon } from '@material-ui/icons/';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

const useStyles = makeStyles({
  Checkbox: {
    padding: 12,
  },
  TextField: {
    maxWidth: 500,
    margin: 0,
  },
  TextField__input: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: 50,
    padding: 0,
  },
  Tooltip: {
    fontSize: 16,
  },
});

const TodoList = (props) => {
  const classes = useStyles();

  const handleEditTodo = (e, todo) => {
    e.stopPropagation();
    props.editTodoContent(todo, e.target.value);
  };

  const handleToggleTodo = (e, todo) => {
    e.stopPropagation();
    props.toggleTodo(todo.id, todo.finished);
  };

  const handleSubmitTodo = (e, todo) => {
    e.preventDefault();
    if (!todo.duplicate) {
      props.updateTodo(todo.id).then((status) => {
        if (status === 'Success') {
          document.activeElement.blur();
        }
      });
    }
  };

  const handleDeleteTodo = (e, todo) => {
    e.stopPropagation();
    props.deleteTodo(todo);
  };

  const TodoListStyle = {
    height:
      0.75 * window.innerHeight -
      140 -
      ((0.75 * window.innerHeight - 140) % 50),
  };

  const generateTodoTooltip = (todo) => {
    console.log(todo.createdDate, todo.dueDate);
    return (
      <>
        <p>
          Created:
          {format(parseISO(todo.createdDate), 'MM/dd/yyyy')}
        </p>
        <p>
          Due:
          {format(parseISO(todo.dueDate), 'MM/dd/yyyy')}
        </p>
      </>
    );
  };

  return (
    <ul className="TodoList" style={TodoListStyle}>
      {props.todoList.map((todo) => (
        <li
          key={todo.id}
          className={clsx(
            'TodoList__li',
            todo.finished && 'TodoList__li--finished'
          )}
          onClick={(e) => handleToggleTodo(e, todo)}
        >
          <Tooltip title="Complete" classes={{ tooltip: classes.Tooltip }}>
            <Checkbox
              id={todo.content}
              classes={{ root: classes.Checkbox }}
              name="todo"
              color="primary"
              checked={todo.finished}
            />
          </Tooltip>

          <Tooltip
            key={todo.id}
            title={generateTodoTooltip(todo)}
            placement="right"
            classes={{ tooltip: classes.Tooltip }}
            arrow
          >
            <form
              className="TodoList__li__form"
              onSubmit={(e) => handleSubmitTodo(e, todo)}
            >
              <TextField
                classes={{ root: classes.TextField }}
                value={todo.content}
                onChange={(e) => handleEditTodo(e, todo)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: `${todo.content.length + 5}ch`,
                }}
                InputProps={{
                  disableUnderline: !todo.duplicate,
                  classes: { input: classes.TextField__input },
                }}
                error={todo.duplicate}
                rowsMax={1}
              />
            </form>
          </Tooltip>
          <Tooltip title="Delete" classes={{ tooltip: classes.Tooltip }}>
            <IconButton
              color="secondary"
              aria-label="delete"
              onClick={(e) => handleDeleteTodo(e, todo)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
