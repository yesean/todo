import React, { useEffect } from 'react';
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
import { format } from 'date-fns';

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

const TodoList = ({ todoList, handleTodoChange, updateTodo, deleteTodo }) => {
  const classes = useStyles();

  useEffect(() => {
    const preventBlur = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const preventTabbing = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (todoList.some((todo) => todo.duplicate)) {
      document.addEventListener('mousedown', preventBlur);
      document.addEventListener('keydown', preventTabbing);
      return () => {
        document.removeEventListener('mousedown', preventBlur);
        document.removeEventListener('keydown', preventTabbing);
      };
    }
  }, [todoList]);

  const handleEditTodo = (e, todo) => {
    handleTodoChange(todo.id, { content: e.target.value });
  };

  const handleToggleTodo = (e, todo) => {
    if (!todoList.some((t) => t.duplicate)) {
      updateTodo({ ...todo, finished: !todo.finished });
    }
  };

  const handleSubmitTodo = (e, todo) => {
    e.preventDefault();
    if (!todo.duplicate) {
      updateTodo(todo)
        .then((res) => {
          document.activeElement.blur();
        })
        .catch(console.log);
    }
  };

  const handleDeleteTodo = (e, todo) => {
    e.stopPropagation();
    deleteTodo(todo);
  };

  const generateTodoTooltip = (todo) => {
    return (
      <>
        <p>{`Created: ${format(todo.createdDate, 'MM/dd/yyyy')}`}</p>
        <p>{`Due: ${format(todo.dueDate, 'MM/dd/yyyy')}`}</p>
      </>
    );
  };

  return (
    <ul className="TodoList">
      {todoList.map((todo) => (
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
                error={todo.duplicate}
                onChange={(e) => handleEditTodo(e, todo)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: `${todo.content.length + 5}ch`,
                }}
                InputProps={{
                  disableUnderline: !todo.duplicate,
                  classes: {
                    input: classes.TextField__input,
                  },
                }}
              />
            </form>
          </Tooltip>
          <Tooltip title="Delete" classes={{ tooltip: classes.Tooltip }}>
            <IconButton
              color="primary"
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
