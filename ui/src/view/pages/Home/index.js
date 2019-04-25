import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import { collection } from 'actions/characters';

import BasicLayout from 'view/layouts/BasicLayout';
import CharacterCard from './CharacterCard';

import styles from './styles.module.css';



class Home extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      displayStyle: {
        position: 'absolute',
        visibility: 'hidden'
      }
    }
  }

  componentDidMount() {
    this.props.getCharacters();
    setTimeout(() => {
      this.setState({
        displayStyle: {
          position: 'relative',
          visibility: 'visible'
        }
      })
    }, 1000);
  };

  render() {
    const characters = this.props.characters;
    return (
      <BasicLayout>
        <div className={styles.root} style={this.state.displayStyle}>
          {
            !characters
              ? null
              : characters.map((character, i) => {
                return <CharacterCard key={i} character={character} />
              })
          }
        </div>

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
