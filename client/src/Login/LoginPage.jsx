import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Grid } from '@material-ui/core';
import loginService from '../services/login';
import todoService from '../services/todo';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

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
    setIsUsernameValid(true);
    setIsPasswordValid(true);
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInTodoAppUser', JSON.stringify(user));
      todoService.setToken(user.token);
      setUsername('');
      setPassword('');
      setUser({ username });
    } catch (error) {
      const errorMessage = error.data.error;
      if (errorMessage === 'invalid username') {
        setIsUsernameValid(false);
      } else if (errorMessage === 'invalid password') {
        setIsPasswordValid(false);
      }
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={8}
      >
        <Grid
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid md item>
            <TextField
              error={!isUsernameValid}
              helperText={!isUsernameValid && 'Invalid Username'}
              label="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </Grid>
          <Grid md item>
            <TextField
              error={!isPasswordValid}
              helperText={!isPasswordValid && 'Invalid Password'}
              type="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
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
      </Grid>
    </form>
  );
};

export default LoginPage;
