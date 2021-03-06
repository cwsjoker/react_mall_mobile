import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import './assets/style/default.css'

import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';

import Layout from './pages/layout/Layout';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Igo_bt from './pages/activity/IGO_BT';
import Promote from './pages/activity/Promote';

class App extends Component {
  render() {
    return (
      <Router basename={'/mobile/#'}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/IGO" component={Igo_bt} />
          <Route exact path="/promote" component={Promote} />
          <Route path="/" component={Layout} />
        </Switch>
      </Router>
    );
  }
}

export default App;
