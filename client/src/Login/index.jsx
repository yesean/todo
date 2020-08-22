import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
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

const Login = ({ setIsAuthenticated, setUser }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" classes={{ root: classes.root }}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage
              setUser={setUser}
              setIsAuthenticated={setIsAuthenticated}
            />
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
