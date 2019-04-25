import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import Link from 'view/components/Link';

import styles from './styles.module.css';

class BasicLayout extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func
  };

  render() {
    return (
      <div className={styles.root}> {/* eslint-ignore-line */}
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.logo}></div>
            <div className={styles.title}><h1>GoT Death Pool</h1></div>
            <div className={styles.quote}>I swear if they don't cover Jaime's golden hand in dragon glass to pimp slap the shit out of white walkers, then what has this all been about?</div>
          </div>
          <div className={styles.body}>{this.props.children}</div>
          <div className={styles.footer}></div>
        </div>
      </div>
    );
  }
}

const getState = (globalState) => ({});

const actions = {
  push
};

export default connect(getState, actions)(BasicLayout);
