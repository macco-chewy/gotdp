import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import CharacterCard from 'view/components/CharacterCard';

import styles from './styles.module.css';


class Home extends Component {
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

  handleCharacterCardClick = (characterId) => {
    // const nextCharacterId = (characterId !== this.state.activeCharacterId) ? characterId : '';
    // this.setState({
    //   activeCharacterId: nextCharacterId
    // });
    this.props.push(`/characters/${characterId}`);
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

const mapStateToProps = (state) => ({
  characters: state.characters,
  users: state.users
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(Home);
