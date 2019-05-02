import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import { collection as characterCollection } from 'actions/characters';
import { collection as userCollection } from 'actions/users';

import CharacterCard from 'view/components/CharacterCard';

import styles from './styles.module.css';


class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    cid: PropTypes.string,
    push: PropTypes.func,
    users: PropTypes.any
  };

  render() {
    const { characters, cid, users } = this.props;
    const character = characters.find(character => {
      return character.id === cid;
    });

    return (
      <div className={styles.root}>
        <CharacterCard character={character} users={users} active={true} className={styles.card} />
      </div>
    );
  }
}

const getState = (globalState, ownProps) => ({
  characters: globalState.characters,
  cid: ownProps.match.params.cid,
  users: globalState.users
});

const actions = {
  getCharacters: characterCollection.get,
  getUsers: userCollection.get,
  push
};

export default connect(getState, actions)(Home);
