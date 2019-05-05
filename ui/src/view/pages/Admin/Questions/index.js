import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { update as updateQuestions } from 'actions/questions';

import styles from './styles.module.css';



const QuestionFormRow = (props) => {
  const { question, onChange } = props;
  const questionName = `ques_${question.id}`;
  const type = question.attributes.type;

  let value = question.attributes.correctAnswer;

  let rowStyle = styles.formRow;
  if (value) {
    rowStyle = classnames(rowStyle, styles.status1);
  }

  switch (type) {
    case 'text':
      return (
        <div className={rowStyle}>
          <label className={styles.formItemLabel} htmlFor={questionName}><h4>{question.attributes.text}</h4></label>
          <div className={classnames(styles.formItem, styles.flex3)}>
            <input type="text" className="form-control" id={questionName} name={questionName} value={value || '-'} onFocus={(e) => e.target.select()} onChange={onChange} />
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



class Questions extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    questions: PropTypes.any,
    updateQuestions: PropTypes.func,
    push: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      questions: undefined
    }
  }

  componentWillMount() {
    this.setState({ questions: [...this.props.questions] });
  }

  handleAnswerUpdate = (event) => {
    const bits = event.target.id.split('_');
    const type = event.target.type;
    const id = bits[1];

    let value;
    switch (type) {
      case 'radio':
        value = bits[2];
        break;
      default:
        value = event.target.value;
        break;
    }

    const questions = [...this.state.questions].map(question => {
      if (question.id === id) {
        question.attributes.correctAnswer = value;
      }
      return question;
    });

    this.setState({ canSubmit: true, questions });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const updates = this.state.questions.filter(question => {
      return (question.attributes.correctAnswer);
    });

    // submit updates
    this.props.updateQuestions(updates);

    // route
    this.props.push('/admin/success');
  };

  render() {
    const { isLoading } = this.props;
    const { questions, canSubmit } = this.state;

    return (
      <div className={styles.root}>
        <form onSubmit={this.handleFormSubmit}>

          <div className={styles.formRow}>
            <h2>Questions</h2>
          </div>
          {
            questions.length === 0
              ? null
              : questions.map((question, i) => {
                return <QuestionFormRow key={i} question={question} onChange={this.handleAnswerUpdate} />
              })
          }

          <div className={styles.formRowSpacer} />

          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <button type="submit" className="btn btn-primary" disabled={isLoading || !canSubmit}>Save answers</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.global.isLoading,
  questions: state.questions
});

const actions = {
  updateQuestions: updateQuestions.submit,
  push
};

export default connect(mapStateToProps, actions)(Questions);
