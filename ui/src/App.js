import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-body">
          <div className="app-header">
            <div className="app-logo"></div>
            <div className="app-title"><h1>GoT Death Pool</h1></div>
            <div className="app-header-quote">I swear if they don't cover Jaime's golden hand in dragon glass to pimp slap the shit out of white walkers, then what has this all been about?</div>
          </div>
          <div className="app-content">Coming soon</div>
          <div className="app-footer"></div>
        </div>
      </div>
    );
  }
}

export default App;
