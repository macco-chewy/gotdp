import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';

import CharacterHead from 'view/components/CharacterHead';
import Panel from 'view/components/Panel';

import styles from './styles.module.css';


class CharacterPanel extends Component {
  static propTypes = {
    characters: PropTypes.any,
    push: PropTypes.func
  };

  handleCharacterCardClick = (characterId) => {
    this.props.push(`/characters/${characterId}`);
  };

  render() {
    const { characters } = this.props;
    return (
      <Panel header="Characters" className={styles.root} bodyClassName={styles.body}>
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

const mapStateToProps = (state) => ({
  characters: state.characters
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(CharacterPanel);
