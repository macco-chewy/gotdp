import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import { collection } from 'actions/characters';
import { create } from 'actions/user';

import BasicLayout from 'view/layouts/BasicLayout';

import styles from './styles.module.css';



const CharacterFormRow = (props) => {
  const { character } = props;
  const radioName = `rad_${character.id}`;
  return (
    <div className={styles.formRow}>
      <div className={styles.formItemLabel}>
        <h4>{character.attributes.name}</h4>
      </div>
      <div className={styles.formItem}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_1`} value="1" />
        <label className="form-check-label" htmlFor={`${radioName}_1`}>&nbsp;Alive</label>
      </div>
      <div className={styles.formItem}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_2`} value="2" />
        <label className="form-check-label" htmlFor={`${radioName}_2`}>&nbsp;Deceased</label>
      </div>
      <div className={styles.formItem}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_3`} value="3" />
        <label className="form-check-label" htmlFor={`${radioName}_3`}>&nbsp;Wight / Wight Walker</label>
      </div>
    </div>
  );
}



class User extends Component {
  static propTypes = {
    characters: PropTypes.any,
    createUser: PropTypes.func,
    getCharacters: PropTypes.func,
    isLoading: PropTypes.bool,
    push: PropTypes.func
  };

  componentDidMount() {
    const { characters } = this.props;
    if (!characters || !Array.isArray(characters) || characters.length === 0) {
      this.props.getCharacters();
    }
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const values = {
      bids: {}
    };

    const elements = event.target.elements;
    for (let i = 0, x = elements.length; i < x; i++) {
      const element = elements[i];
      switch (element.type) {
        case 'text':
          const id = element.id;
          values[id] = element.value;
          break;
        case 'radio':
          if (element.checked) {
            const id = element.name.replace('rad_', '');
            values.bids[id] = element.value;
          }
          break;
        default:
          // console.log(element.type);
          break;
      }
    }

    console.log(values);
    this.props.createUser(values);
  };

  render() {
    const { characters, isLoading } = this.props;
    return (
      <BasicLayout>
        <div className={styles.root}>
          <form onSubmit={this.handleFormSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label htmlFor="name">User</label>
                <input type="text" className="form-control" id="name" name="name" />
              </div>
            </div>

            {
              !characters
                ? null
                : characters.map((character, i) => {
                  return <CharacterFormRow key={i} character={character} />
                })
            }

            <div className={styles.formRow}>
              <div className={styles.formItemLabel}>
                Here is some question text that should take up a considerable amount of space.
            </div>
              <div className={styles.formItem}>
                <input type="text" className="form-control" id="question1" name="question1" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formItemLabel}>
                Here is some question text that should take up a considerable amount of space.
            </div>
              <div className={styles.formItem}>
                <input type="text" className="form-control" id="question2" name="question2" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formItemLabel}>
                Here is some question text that should take up a considerable amount of space.
            </div>
              <div className={styles.formItem}>
                <input type="text" className="form-control" id="question3" name="question3" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Create user</button>
              </div>
            </div>
          </form>
        </div>
      </BasicLayout>
    );
  }
}

const getState = (globalState) => ({
  characters: globalState.characters,
  isLoading: globalState.global.isLoading
});

const actions = {
  getCharacters: collection.get,
  createUser: create.submit,
  push
};

export default connect(getState, actions)(User);
