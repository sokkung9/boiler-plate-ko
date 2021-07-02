import './App.css';
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LandingPage, LoginPage, RegisterPage } from './views';
import Auth from './components/hoc/auth';

function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/"         component={Auth(LandingPage, null)}/>
          <Route path="/register"       component={Auth(RegisterPage, false)}/>
          <Route path="/login"          component={Auth(LoginPage, false)}/>
          {/* <Route exact path="/"         render={(props) => <LandingPage   {...props}/>}/>
          <Route path="/register"       render={(props) => <RegisterPage   {...props}/>}/>
          <Route path="/login"          render={(props) => <LoginPage   {...props}/>}/> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
