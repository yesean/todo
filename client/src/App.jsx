import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blueGrey, cyan } from '@material-ui/core/colors/';
import Todo from './Todo';
import Login from './Login';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[300],
    },
    secondary: {
      main: cyan[300],
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Redirect to={!isAuthenticated ? '/login' : '/todos'} />
        <Switch>
          <Route path="/login">
            <Login setIsAuthenticated={setIsAuthenticated} />
          </Route>
          <Route path="/todos">
            <Todo />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
