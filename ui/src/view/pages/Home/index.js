import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CharacterPanel from './CharacterPanel';
import LeaderBoard from 'view/components/LeaderBoard';

import styles from './styles.module.css';


class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    users: PropTypes.any
  };

  render() {
    const { characters, users } = this.props;

    if (!characters.length || !users.length) {
      return null;
    }

    return (
      <div className={styles.root}>
        <div className={styles.leaderboardPanel}><LeaderBoard characters={characters} users={users} /></div>
        <div className={styles.characterPanel}><CharacterPanel characters={characters} /></div>
      </div>
    );
  }
}

const getState = (globalState) => ({
  characters: globalState.characters,
  users: globalState.users
});

const actions = {};

export default connect(getState, actions)(Home);
