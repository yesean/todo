import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Container,
  makeStyles,
} from '@material-ui/core';
import LoginPage from './LoginPage';
import CreateAccount from './CreateAccount';

const useStyles = makeStyles({
  root: {
    height: 'calc(100vh - 16px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const Login = ({ setIsAuthenticated }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" classes={{ root: classes.root }}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          </Route>
          <Route path="/create">
            <CreateAccount setIsAuthenticated={setIsAuthenticated} />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default Login;
