import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CharacterCard from 'view/components/CharacterCard';

import styles from './styles.module.css';



export default class CharacterPanel extends Component {
  static propTypes = {
    characters: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      activeCharacterId: ''
    }
  }

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
