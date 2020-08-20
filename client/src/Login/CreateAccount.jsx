import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid } from '@material-ui/core';

const CreateAccount = ({ setIsAuthenticated, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {}, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const item = localStorage.getItem('key');
    if (item) {
      console.log(item);
    } else {
      localStorage.setItem('key', 'benis');
    }
    console.log('submitting');
    setIsAuthenticated(true);
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
            label="Set Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </Grid>
        <Grid md item>
          <TextField
            type="password"
            label="Set Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Grid>
        <Grid md item>
          <Button type="submit" variant="contained" color="secondary">
            Create Account
          </Button>
        </Grid>
        <Grid md item>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Login
            </Button>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateAccount;
