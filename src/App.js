import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';

import Layout from './pages/layout/Layout';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route exact path="/mining" component={Mining} /> */}
          <Route path="/" component={Layout} />
        </Switch>
      </Router>
    );
  }
}

export default App;
