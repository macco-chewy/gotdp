import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { collection as characterCollection } from 'actions/characters';
import { collection as questionCollection } from 'actions/questions';
import { collection as userCollection } from 'actions/users';

class Refresher extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    getQuestions: PropTypes.func,
    getUsers: PropTypes.func,
    questions: PropTypes.any,
    users: PropTypes.any
  };
  
  constructor(props){
    super(props);

    this.state = {
      interval: 0
    }
  }

  componentDidMount() {
    this.refresh();

    // set interval
    this.setState({
      interval: setInterval(this.refresh, 60000)
    })
  };

  refresh = () => {
    this.props.getCharacters();
    this.props.getQuestions();
    this.props.getUsers();
  }

  render() {
    const { characters, questions, users } = this.props;
    if (!characters.length || !questions.length || !users.length) {
      return null;
    }

    return (
      <Fragment>{this.props.children}</Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  characters: state.characters,
  questions: state.questions,
  users: state.users
});

const actions = {
  getCharacters: characterCollection.get,
  getQuestions: questionCollection.get,
  getUsers: userCollection.get
};

export default connect(mapStateToProps, actions)(Refresher);
