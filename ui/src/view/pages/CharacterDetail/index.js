import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import CharacterCard from 'view/components/CharacterCard';
import PageHeader from 'view/components/PageHeader';

import styles from './styles.module.css';


class CharacterDetail extends Component {
  static propTypes = {
    characters: PropTypes.any,
    name: PropTypes.string,
    push: PropTypes.func,
    users: PropTypes.any
  };

  render() {
    const { characters, name, users } = this.props;
    const character = characters.find(character => {
      return character.name === name;
    });

    return (
      <div className={styles.root}>
        <PageHeader legend="status">Character Detail - {character.name}</PageHeader>
        <CharacterCard character={character} users={users} active={true} className={styles.card} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  characters: state.characters,
  name: ownProps.match.params.name,
  users: state.users
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(CharacterDetail);
