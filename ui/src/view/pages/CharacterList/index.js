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
    push: PropTypes.func,
    users: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      activeCharacterId: ''
    }
  }

  componentDidMount() {
    const { characters, users } = this.props;
    if (!characters || typeof characters !== 'object' || characters.length === 0) {
      this.props.getCharacters();
    }
    if (!users || typeof users !== 'object' || users.length === 0) {
      this.props.getUsers();
    }
  };

  handleCharacterCardClick = (characterId) => {
    const nextCharacterId = (characterId !== this.state.activeCharacterId) ? characterId : '';
    this.setState({
      activeCharacterId: nextCharacterId
    });
  }

  render() {
    const { characters, users } = this.props;
    const { activeCharacterId } = this.state;

    return (
      <div className={styles.root}>
        {
          characters.length === 0
            ? null
            : characters.map((character, i) => {
              return <CharacterCard key={i} character={character} users={users} onClick={this.handleCharacterCardClick} active={character.id === activeCharacterId} />
            })
        }
      </div>
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
