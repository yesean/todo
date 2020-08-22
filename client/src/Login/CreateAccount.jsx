import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Grid } from '@material-ui/core';

import userService from '../services/user';

const CreateAccount = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await userService.createAccount({ username, password });
      console.log('user', newUser, 'created!');
      setUsername('');
      setPassword('');
    } catch (error) {
      const errorMessage = error.data.error;
      if (errorMessage.includes(`expected \`username\` to be unique`)) {
        setUsernameError('Username taken');
      } else if (errorMessage.includes(`Path \`username\` is required`)) {
        setUsernameError('Username required');
      }
      console.error(error);
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
            error={Boolean(usernameError)}
            label={usernameError || 'Username'}
            value={username}
            onChange={handleUsernameChange}
          />
        </Grid>
        <Grid md item>
          <TextField
            type="password"
            label="Password"
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
            <Button variant="text" color="primary">
              Login
            </Button>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateAccount;
