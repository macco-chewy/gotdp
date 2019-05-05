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

const mapStateToProps = (state) => ({
  characters: state.characters,
  users: state.users
});

const actions = {};

export default connect(mapStateToProps, actions)(Home);
