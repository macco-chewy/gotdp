import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import CharacterCard from 'view/components/CharacterCard';

import styles from './styles.module.css';


class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
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

const mapStateToProps = (state, ownProps) => ({
  characters: state.characters,
  cid: ownProps.match.params.cid,
  users: state.users
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(Home);
