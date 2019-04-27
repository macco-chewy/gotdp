import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import BasicLayout from 'view/layouts/BasicLayout';

import styles from './styles.module.css';



class Success extends Component {
  static propTypes = {
    push: PropTypes.func
  };

  render() {
    return (
      <BasicLayout>
        <div className={styles.root}>
          Success
        </div>
      </BasicLayout>
    );
  }
}

const getState = (globalState) => ({});

const actions = {
  push
};

export default connect(getState, actions)(Success);
