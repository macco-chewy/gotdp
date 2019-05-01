import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import styles from './styles.module.css';



class Success extends Component {
  static propTypes = {
    push: PropTypes.func
  };

  render() {
    return (
      <div className={styles.root}>
        Success
        </div>
    );
  }
}

const getState = (globalState) => ({});

const actions = {
  push
};

export default connect(getState, actions)(Success);
