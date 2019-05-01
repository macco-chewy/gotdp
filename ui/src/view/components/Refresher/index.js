import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { collection as characterCollection } from 'actions/characters';
import { collection as userCollection } from 'actions/users';

class Refresher extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    getUsers: PropTypes.func,
    users: PropTypes.any
  };

  componentDidMount() {
    this.refresh();

    // set interval
  };

  refresh = () => {
    this.props.getCharacters();
    this.props.getUsers();
  }

  render() {
    const { characters, users } = this.props;
    if (characters.length === 0 || users.length === 0) {
      return null;
    }

    return (
      <Fragment>{this.props.children}</Fragment>
    );
  }
}

const getState = (globalState) => ({
  characters: globalState.characters,
  users: globalState.users
});

const actions = {
  getCharacters: characterCollection.get,
  getUsers: userCollection.get
};

export default connect(getState, actions)(Refresher);
