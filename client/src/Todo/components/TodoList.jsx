import React, { useState } from 'react';
import './../styles/TodoList.css';
import {
  TextField,
  IconButton,
  Checkbox,
  Tooltip,
  makeStyles,
} from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import blueGrey from '@material-ui/core/colors/blueGrey';
import clsx from 'clsx';
import { format, compareAsc } from 'date-fns';

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
  const [isSecondaryTooltipShowing, setIsSecondaryTooltipShowing] = useState(
    false
  );
  const classes = useStyles();

  const handleEditTodo = (e, todo) => {
    e.stopPropagation();
    props.editTodo(todo, e.target.value);
  };

  const handleToggleTodo = (e, todo) => {
    props.toggleTodo(todo);
  };

  const handleSubmitTodo = (e, todo) => {
    e.preventDefault();
    if (!todo.duplicate) {
      document.activeElement.blur();
    }
  };

  const handleDeleteTodo = (e, todo) => {
    e.stopPropagation();
    props.removeTodo(todo);
  };

  const TodoListStyle = {
    height:
      0.75 * window.innerHeight -
      140 -
      ((0.75 * window.innerHeight - 140) % 50),
  };

  const generateTodoTooltip = (todo) => {
    return <p>Due: {format(todo.dueDate, 'MM/dd/yyyy')}</p>;
  };

  return (
    <ul className="TodoList" style={TodoListStyle}>
      {props.todoList.map((todo) => (
        <Tooltip
          key={todo.id}
          title={isSecondaryTooltipShowing ? '' : generateTodoTooltip(todo)}
          classes={{ tooltip: classes.Tooltip }}
        >
          <li
            key={todo.id}
            className={clsx(
              'TodoList__li',
              todo.finished && 'TodoList__li--finished'
            )}
            onClick={(e) => handleToggleTodo(e, todo)}
          >
            <Tooltip
              title="Complete"
              classes={{ tooltip: classes.Tooltip }}
              onOpen={() => setIsSecondaryTooltipShowing(true)}
              onClose={() => setIsSecondaryTooltipShowing(false)}
            >
              <Checkbox
                id={todo.content}
                classes={{ root: classes.Checkbox }}
                name="todo"
                color="primary"
                checked={todo.finished}
              />
            </Tooltip>

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
            <Tooltip
              title="Delete"
              classes={{ tooltip: classes.Tooltip }}
              onOpen={() => setIsSecondaryTooltipShowing(true)}
              onClose={() => setIsSecondaryTooltipShowing(false)}
            >
              <IconButton
                color="secondary"
                aria-label="delete"
                onClick={(e) => handleDeleteTodo(e, todo)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </li>
        </Tooltip>
      ))}
    </ul>
  );
};

export default TodoList;
