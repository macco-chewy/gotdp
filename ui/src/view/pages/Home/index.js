import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import { collection } from 'actions/characters';

import BasicLayout from 'view/layouts/BasicLayout';



const CharacterCard = function (props) {
  const { character } = props;
  return (<div>{character.attributes.name}</div>);
}



class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func
  };

  componentDidMount() {
    this.props.getCharacters();
  };

  render() {
    const characters = this.props.characters;
    return (
      <BasicLayout>
        {
          !characters
            ? null
            : characters.map((character, i) => {
              return <CharacterCard key={i} character={character} />
            })
        }
      </BasicLayout>
    );
  }
}

const getState = (globalState) => ({
  characters: globalState.characters
});

const actions = {
  getCharacters: collection.get,
  push
};

export default connect(getState, actions)(Home);
