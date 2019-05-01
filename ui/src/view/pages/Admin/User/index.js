import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { collection as characterCollection } from 'actions/characters';
import { collection as questionCollection } from 'actions/questions';
import { create as createUser, get as getUser } from 'actions/user';

import BasicLayout from 'view/layouts/BasicLayout';

import styles from './styles.module.css';



const CharacterFormRow = (props) => {
  const { character, user, onChange } = props;
  const radioName = `char_${character.id}`;
  const itemClassNames = classnames(styles.formItem, styles.flex1);

  let value;
  if (user && user.attributes && user.attributes.bids && user.attributes.bids[character.id]) {
    value = user.attributes.bids[character.id];
  }
  if (value === undefined) {
    value = '';
  }

  let rowStyle = styles.formRow;
  if (value !== '') {
    rowStyle = classnames(rowStyle, styles[`status${value}`]);
  }

  return (
    <div className={rowStyle}>
      <div className={styles.formItemLabel}>
        <h3>{character.attributes.displayName}</h3>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_1`} value="1" checked={value === '1'} onChange={onChange} />
        <label className="form-check-label" htmlFor={`${radioName}_1`}>&nbsp;Alive</label>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_2`} value="2" checked={value === '2'} onChange={onChange} />
        <label className="form-check-label" htmlFor={`${radioName}_2`}>&nbsp;Deceased</label>
      </div>
      <div className={itemClassNames}>
        <input className="form-check-input" type="radio" name={radioName} id={`${radioName}_3`} value="3" checked={value === '3'} onChange={onChange} />
        <label className="form-check-label" htmlFor={`${radioName}_3`}>&nbsp;Wight / Wight Walker</label>
      </div>
    </div>
  );
}


const QuestionFormRow = (props) => {
  const { question, user, onChange } = props;
  const questionName = `ques_${question.id}`;
  const type = question.attributes.type;

  let value;
  if (user && user.attributes && user.attributes.questions && user.attributes.questions[question.id]) {
    value = user.attributes.questions[question.id];
  }
  if (value === undefined) {
    value = '';
  }

  let rowStyle = styles.formRow;
  if (value !== '') {
    rowStyle = classnames(rowStyle, styles.status1);
  }

  switch (type) {
    case 'text':
      return (
        <div className={rowStyle}>
          <label className={styles.formItemLabel} htmlFor={questionName}><h4>{question.attributes.text}</h4></label>
          <div className={classnames(styles.formItem, styles.flex3)}>
            <input type="text" className="form-control" id={questionName} name={questionName} value={value} onChange={onChange} />
          </div>
        </div>
      );
    case 'radio':
      const classNames = classnames(styles.formItem, styles.flex1);
      return (
        <div className={rowStyle}>
          <div className={styles.formItemLabel}><h4>{question.attributes.text}</h4></div>
          <div className={classNames} />

          {
            question.attributes.answers.map((answer, i) => {
              return (
                <div className={classNames} key={i}>
                  <input className="form-check-input" type="radio" name={questionName} id={`${questionName}_${i + 1}`} value={answer.value} checked={answer.value === value} onChange={onChange} />
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
    clearUser: PropTypes.func,
    createUser: PropTypes.func,
    getCharacters: PropTypes.func,
    getUser: PropTypes.func,
    isLoading: PropTypes.bool,
    questions: PropTypes.any,
    push: PropTypes.func,
    user: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false
    }
  }

  componentWillMount() {
    this.props.clearUser();
  }

  componentDidMount() {
    const { characters, questions } = this.props;
    if (!characters || typeof characters !== 'object' || characters.length === 0) {
      this.props.getCharacters();
    }
    if (!questions || typeof questions !== 'object' || questions.length === 0) {
      this.props.getQuestions();
    }
  };

  componentWillUpdate(nextProps) {
    // check if user has changed
    if (nextProps.user) {
      if (!this.state.user || this.state.user.id !== nextProps.user.id) {
        this.setState({ user: nextProps.user });
      }
    } else {
      if (!this.state.user || this.state.user.id) {
        this.setState({
          user: {
            name: document.querySelector('#search_name').value,
            attributes: {
              bids: {},
              questions: {}
            }
          }
        });
      }
    }
  }

  handleNameChange = (event) => {
    const value = event.target.value;
    const user = Object.assign({}, this.state.user);
    user.name = value;
    this.setState({ canSubmit: value !== '', user });
  }

  handleUsernameSearch = (event) => {
    event.preventDefault();

    const element = document.querySelector('#search_name');
    this.props.getUser(element.value);
  }

  handleAnswerUpdate = (event) => {
    const bits = event.target.id.split('_');
    const type = event.target.type;
    const category = bits[0];
    const id = bits[1];
    const user = Object.assign({}, this.state.user);

    let value;
    switch (type) {
      case 'radio':
        value = bits[2];
        break;
      default:
        value = event.target.value;
        break;
    }

    switch (category) {
      case 'char':
        user.attributes.bids[id] = value;
        break;
      case 'ques':
        user.attributes.questions[id] = event.target.value;
        break;
      default:
        user.attributes[id] = value;
        break;
    }
    this.setState({ user });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    // const data = {
    //   name: '',
    //   attributes: {
    //     bids: {},
    //     questions: {}
    //   }
    // };

    // const elements = event.target.elements;
    // for (let i = 0, x = elements.length; i < x; i++) {
    //   const element = elements[i];
    //   element.disabled = true;
    //   const type = element.type;
    //   const category = element.name.substr(0, 5);
    //   const property = element.name.substr(5);

    //   let value;
    //   switch (type) {
    //     case 'radio':
    //       if (element.checked) {
    //         value = element.value;
    //       }
    //       break;
    //     default:
    //       value = element.value;
    //       break;
    //   }

    //   // skip if no value
    //   if (!value) {
    //     continue;
    //   }

    //   switch (category) {
    //     case 'user_':
    //       data[property] = value;
    //       break;
    //     case 'char_':
    //       data.bids[property] = value;
    //       break;
    //     case 'ques_':
    //       data.questions[property] = value;
    //       break;
    //     default:
    //       break;
    //   }
    // }
    // console.log(data);
    // this.props.createUser(data);

    const user = this.state.user;
    this.props.createUser(user);

    this.props.push('/admin/success');
  };

  render() {
    const { characters, isLoading, questions, user: stateUser } = this.props;
    const { user, canSubmit } = this.state;

    return (
      <BasicLayout>
        <div className={styles.root}>
          <form onSubmit={this.handleUsernameSearch}>
            <div className={styles.formRow}>
              <h2>User Details</h2>
            </div>
            <div className={styles.formRow}>
              <div className={classnames(styles.formItem, styles.flex1)}>
                <label htmlFor="search_name"><h3>Name</h3></label>
                <input type="text" className="form-control" id="search_name" name="search_name" onChange={this.handleNameChange} />
                <div>
                  <button type="submit" className="btn btn-primary" style={{ margin: '.4rem .4rem 0 0' }} disabled={isLoading || !canSubmit}>Search</button>
                  <button type="button" className="btn btn-primary" style={{ margin: '.4rem .4rem 0 0' }} onClick={this.handleUserDelete} disabled={isLoading || !stateUser}>Delete</button>
                </div>
              </div>
            </div>

            <div className={styles.formRowSpacer} />
          </form>

          <form onSubmit={this.handleFormSubmit}>

            <div className={styles.formRow}>
              <h2>Character Statuses</h2>
            </div>
            {
              characters.length === 0
                ? null
                : characters.map((character, i) => {
                  return <CharacterFormRow key={i} character={character} user={user} onChange={this.handleAnswerUpdate} />
                })
            }

            <div className={styles.formRowSpacer} />

            <div className={styles.formRow}>
              <h2>Questions</h2>
            </div>
            {
              questions.length === 0
                ? null
                : questions.map((question, i) => {
                  return <QuestionFormRow key={i} question={question} user={user} onChange={this.handleAnswerUpdate} />
                })
            }

            <div className={styles.formRowSpacer} />

            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <button type="submit" className="btn btn-primary" disabled={isLoading || !canSubmit}>Save user details</button>
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
  questions: globalState.questions,
  user: globalState.user
});

const actions = {
  getCharacters: characterCollection.get,
  getQuestions: questionCollection.get,
  createUser: createUser.submit,
  getUser: getUser.byName,
  clearUser: getUser.clear,
  push
};

export default connect(getState, actions)(User);
