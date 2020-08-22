import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Grid } from '@material-ui/core';
import loginService from '../services/login';
import todoService from '../services/todo';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginInvalid, setisLoginInvalid] = useState(false);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInTodoAppUser');
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      todoService.setToken(user.token);
    }
  }, [setUser]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInTodoAppUser', JSON.stringify(user));
      todoService.setToken(user.token);
      setUsername('');
      setPassword('');
      setUser({ username });
    } catch (error) {
      setisLoginInvalid(true);
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={3}
      >
        <Grid md item>
          <TextField
            error={isLoginInvalid}
            label="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </Grid>
        <Grid md item>
          <TextField
            error={isLoginInvalid}
            type="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Grid>
        <Grid md item>
          <Button type="submit" variant="contained" color="secondary">
            Login
          </Button>
        </Grid>
        <Grid md item>
          <Link to="/create-account" style={{ textDecoration: 'none' }}>
            <Button variant="text" color="primary">
              Create Account
            </Button>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginPage;
