import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import { collection as characterCollection } from 'actions/characters';
import { collection as userCollection } from 'actions/users';

import BasicLayout from 'view/layouts/BasicLayout';
import CharacterPanel from './CharacterPanel';


class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func,
    users: PropTypes.any
  };

  componentDidMount() {
    const { characters, users } = this.props;
    if (!characters || typeof characters !== 'object' || characters.length === 0) {
      this.props.getCharacters();
    }
    if (!users || typeof users !== 'object' || users.length === 0) {
      this.props.getUsers();
    }
  };

  render() {
    const { characters, users } = this.props;
    return (
      <BasicLayout>
        <CharacterPanel characters={characters} users={users} />
      </BasicLayout>
    );
  }
}

const getState = (globalState) => ({
  characters: globalState.characters,
  users: globalState.users
});

const actions = {
  getCharacters: characterCollection.get,
  getUsers: userCollection.get,
  push
};

export default connect(getState, actions)(Home);
