import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.module.css';

class BasicLayout extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    push: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      bgIndex: 0
    }
  }

  componentWillMount() {
    this.generateNextIndex();
    setInterval(this.generateNextIndex, 60000);
  }


  generateNextIndex = () => {
    this.setState({ bgIndex: Math.floor((Math.random() * 10) + 1) });
  }

  render() {
    let rootClassNames = styles.root;
    const { bgIndex } = this.state;
    if (bgIndex) {
      rootClassNames = classnames(rootClassNames, styles[`bg${this.state.bgIndex}`]);
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
