import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { sendGAPageView, sendGALoadTiming, sendGAScreenViewDuration } from 'utils/ga';

import styles from './styles.module.css';

class BasicLayout extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.loadTimer = Date.now();
    this.screenViewTimer = Date.now();
    this.state = {
      bgIndex: Math.floor((Math.random() * 10) + 1)
    }
  }

  componentDidMount() {
    sendGAPageView(window.location.pathname);
    if (this.loadTimer) {
      sendGALoadTiming(window.location.pathname, Date.now() - this.loadTimer);
      this.loadTimer = 0;
    }
  }

  componentWillUnmount() {
    if (this.screenViewTimer) {
      sendGAScreenViewDuration(window.location.pathname, Date.now() - this.screenViewTimer);
      this.screenViewTimer = 0;
    }
  }

  render() {
    let rootClassNames = styles.root;
    // const { bgIndex } = this.state;
    const bgIndex = 1;
    if (bgIndex) {
      rootClassNames = classnames(rootClassNames, styles[`bg${bgIndex}`]);
    }
    return (
      <div className={rootClassNames}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.logo}></div>
            <div className={styles.title}><h1>GoT Death Pool</h1></div>
            <div className={styles.quote}>I swear if they don't cover Jaime's golden hand in dragon glass to pimp slap the shit out of white walkers, then what has this all been about?</div>
          </div>
          <div className={styles.body}>{this.props.children}</div>
          <div className={styles.footer}>
            <div><span style={{ textDecoration: 'line-through' }}>&copy;</span> 2019 - No Rights Reserved.</div>
            <div>Data provided by <a href="https://gameofthrones.fandom.com" target="new">Game of Thrones Wiki _ FANDOM powered by Wikia</a> without permission.  If this is a problem I'm happy to stop.</div>
          </div>
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
