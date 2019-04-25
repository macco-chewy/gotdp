import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import Home from 'view/pages/Home';
import User from 'view/pages/User';

import { store, history } from 'store';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path='/home' component={Home} />
            <Route exact path='/admin/user' component={User} />
            <Redirect to="/home" />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}
