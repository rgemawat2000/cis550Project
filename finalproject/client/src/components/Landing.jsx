import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from './Login';
import SignUp from "./SignUp";
import Facts from './Facts';

function Landing() {
  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/login"}>CIS 550 Final Project</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/facts"}>Facts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/landing' component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/facts" component={Facts} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default Landing;