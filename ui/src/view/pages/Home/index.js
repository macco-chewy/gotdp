import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import CharacterPanel from './CharacterPanel';
import LeaderBoard from 'view/components/LeaderBoard';
import PageHeader from 'view/components/PageHeader';

import styles from './styles.module.css';


class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    push: PropTypes.func,
    users: PropTypes.any
  };

  handleBidderClick = (name) => {
    this.props.push(`/bidders/${name}`);
  }

  render() {
    const { characters, users } = this.props;

    if (!characters.length || !users.length) {
      return null;
    }

    return (
      <div className={styles.root}>
        <div className={styles.bodyContainer}>
          <div className={styles.leaderboardPanel}>
            <PageHeader legend="rank">Leader Board</PageHeader>
            <LeaderBoard users={users} onClick={this.handleBidderClick} />
          </div>
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

const actions = {
  push
};

export default connect(mapStateToProps, actions)(Home);
