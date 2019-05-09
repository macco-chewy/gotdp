import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PageHeader from 'view/components/PageHeader';
import CharacterPanel from './CharacterPanel';
import LeaderBoard from './LeaderBoard';

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
        <PageHeader legend="rank">Welcome</PageHeader>
        <div className={styles.bodyContainer}>
          <LeaderBoard users={users} className={styles.leaderboardPanel} />
          <CharacterPanel characters={characters} className={styles.characterPanel} />
        </div>
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
