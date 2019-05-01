import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CharacterHead from 'view/components/CharacterHead';
import Panel from 'view/components/Panel';

import styles from './styles.module.css';



export default class CharacterPanel extends Component {
  static propTypes = {
    characters: PropTypes.any
  };

  handleCharacterCardClick = (characterId) => {
    console.log(characterId);
  }

  render() {
    const { characters } = this.props;
    return (
      <Panel header="Characters" className={styles.root}>
        {
          characters.length === 0
            ? null
            : characters.map((character, i) => {
              return <CharacterHead key={i} character={character} onClick={this.handleCharacterCardClick} className={styles.head} />
            })
        }
      </Panel>
    );
  }
}
