import React, { Component } from 'react';
import styles from './styles.module.css';

class BasicLayout extends Component {
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

export default BasicLayout;
