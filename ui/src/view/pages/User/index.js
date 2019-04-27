import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { collection as characterCollection } from 'actions/characters';
import { collection as questionCollection } from 'actions/questions';
import { create as createUser } from 'actions/user';

import BasicLayout from 'view/layouts/BasicLayout';

import styles from './styles.module.css';



const CharacterFormRow = (props) => {
  const { character } = props;
  const radioName = `char_${character.id}`;
  const itemClassNames = classnames(styles.formItem, styles.flex1);
  return (
    <div className={styles.formRow}>
      <div className={styles.formItemLabel}>
        <h5>{character.attributes.displayName}</h5>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_1`} value="1" />
        <label className="form-check-label" htmlFor={`${radioName}_1`}>&nbsp;Alive</label>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_2`} value="2" />
        <label className="form-check-label" htmlFor={`${radioName}_2`}>&nbsp;Deceased</label>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_3`} value="3" />
        <label className="form-check-label" htmlFor={`${radioName}_3`}>&nbsp;Wight / Wight Walker</label>
      </div>
    </div>
  );
}


const QuestionFormRow = (props) => {
  const { question } = props;
  const questionName = `ques_${question.id}`;

  switch (question.attributes.type) {
    case 'text':
      return (
        <div className={styles.formRow}>
          <label className={styles.formItemLabel} htmlFor={questionName}><h5>{question.attributes.text}</h5></label>
          <div className={classnames(styles.formItem, styles.flex3)}>
            <input type="text" className="form-control" id={questionName} name={questionName} />
          </div>
        </div>
      );
    case 'radio':
      const classNames = classnames(styles.formItem, styles.flex1);
      return (
        <div className={styles.formRow}>
          <div className={styles.formItemLabel}><h5>{question.attributes.text}</h5></div>
          <div className={classNames} />

          {
            question.attributes.answers.map((answer, i) => {
              return (
                <div className={classNames} key={i}>
                  <input className="form-check-input" type="radio" name={questionName} id={`${questionName}_${i + 1}`} value={answer.value} />
                  <label className="form-check-label" htmlFor={`${questionName}_${i + 1}`}>&nbsp;{answer.text}</label>
                </div>
              );
            })
          }

        </div>
      );
    default:
      console.error('Unhandled question type', question.attributes.type);
      return null;
  }
}



class User extends Component {
  static propTypes = {
    characters: PropTypes.any,
    createUser: PropTypes.func,
    getCharacters: PropTypes.func,
    isLoading: PropTypes.bool,
    questions: PropTypes.any,
    push: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      searchable: false
    }
  }

  componentDidMount() {
    const { characters, questions } = this.props;
    if (!characters || typeof characters !== 'object' || Object.keys(characters).length === 0) {
      this.props.getCharacters();
    }
    if (!questions || typeof questions !== 'object' || Object.keys(questions).length === 0) {
      this.props.getQuestions();
    }
  };

  handleNameChange = (event) => {
    // this.setState({ searchable: event.target.value !== '' });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const data = {
      bids: {},
      questions: {}
    };

    const elements = event.target.elements;
    for (let i = 0, x = elements.length; i < x; i++) {
      const element = elements[i];
      element.disabled = true;
      const type = element.type;
      const category = element.name.substr(0, 5);
      const property = element.name.substr(5);

      let value;
      switch (type) {
        case 'text':
          value = element.value;
          break;
        case 'radio':
          if (element.checked) {
            value = element.value;
          }
          break;
        default:
          break;
      }

      // skip if no value
      if (!value) {
        continue;
      }

      switch (category) {
        case 'user_':
          data[property] = value;
          break;
        case 'char_':
          data.bids[property] = value;
          break;
        case 'ques_':
          data.questions[property] = value;
          break;
        default:
          break;
      }
    }

    // console.log(JSON.stringify(data));
    this.props.createUser(data);
  };

  render() {
    const { searchable } = this.state;
    const { characters, isLoading, questions } = this.props;
    const characterKeys = (characters && typeof characters === 'object') ? Object.keys(characters) : [];
    const questionKeys = (questions && typeof questions === 'object') ? Object.keys(questions) : [];
    return (
      <BasicLayout>
        <div className={styles.root}>
          <form onSubmit={this.handleFormSubmit}>
            <div className={styles.formRow}>
              <h3>User Details</h3>
            </div>
            <div className={styles.formRow}>
              <div className={classnames(styles.formItem, styles.flex1)}>
                <label htmlFor="user_name"><h5>Name</h5></label>
                <input type="text" className="form-control" id="user_name" name="user_name" onChange={this.handleNameChange} />
                <button type="button" className="btn btn-primary" style={{ marginTop: '.4rem' }} disabled={!searchable}>Search</button>
              </div>
            </div>

            <div className={styles.formRowSpacer} />

            <div className={styles.formRow}>
              <h3>Character Statuses</h3>
            </div>
            {
              !characterKeys.length > 0
                ? null
                : characterKeys.map((name, i) => {
                  return <CharacterFormRow key={i} character={characters[name]} />
                })
            }

            <div className={styles.formRowSpacer} />

            <div className={styles.formRow}>
              <h3>Questions</h3>
            </div>
            {
              !questionKeys.length > 0
                ? null
                : questionKeys.map((name, i) => {
                  return <QuestionFormRow key={i} question={questions[name]} />
                })
            }

            <div className={styles.formRowSpacer} />

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
  isLoading: globalState.global.isLoading,
  questions: globalState.questions
});

const actions = {
  getCharacters: characterCollection.get,
  getQuestions: questionCollection.get,
  createUser: createUser.submit,
  push
};

export default connect(getState, actions)(User);
