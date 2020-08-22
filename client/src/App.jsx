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
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Redirect to={!user ? '/login' : '/todos'} />
        <Switch>
          <Route path="/login">
            <Login setUser={setUser} />
          </Route>
          <Route path="/todos">
            <Todo user={user} setUser={setUser} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
