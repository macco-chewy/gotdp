import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import Refresher from 'view/components/Refresher';

import BasicLayout from 'view/layouts/BasicLayout';

import CharacterList from 'view/pages/CharacterList';
import Home from 'view/pages/Home';
import AdminSuccess from 'view/pages/Admin/Success';
import AdminUser from 'view/pages/Admin/User';

import { store, history } from 'store';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BasicLayout>
            <Refresher>
              <Switch>
                <Route exact path='/admin/success' component={AdminSuccess} />
                <Route exact path='/admin/user' component={AdminUser} />
                <Route exact path="/characters" component={CharacterList} />
                <Route exact path='/home' component={Home} />
                <Redirect to="/home" />
              </Switch>
            </Refresher>
          </BasicLayout>
        </ConnectedRouter>
      </Provider>
    );
  }
}
