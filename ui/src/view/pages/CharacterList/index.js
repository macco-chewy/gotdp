import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import CharacterCard from 'view/components/CharacterCard';
import PageHeader from 'view/components/PageHeader';

import styles from './styles.module.css';


class CharacterList extends Component {
  static propTypes = {
    characters: PropTypes.any,
    push: PropTypes.func,
    users: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      activeCharacterId: ''
    }
  }

  handleCharacterCardClick = (name) => {
    this.props.push(`/characters/${name}`);
  }

  render() {
    const { characters, users } = this.props;
    const { activeCharacterId } = this.state;

    return (
      <div className={styles.root}>
        <PageHeader legend="status">Character List</PageHeader>

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

const mapStateToProps = (state) => ({
  characters: state.characters,
  users: state.users
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(CharacterList);
