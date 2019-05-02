import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { sendGAPageView, sendGALoadTiming, sendGAScreenViewDuration } from 'utils/ga';

import styles from './styles.module.css';



function BackButton(props) {
  const { location, onClick } = props;

  if (location === '/home') {
    return null;
  }

  const handleClick = () => {
    onClick();
  };

  return <span className={styles.link} onClick={handleClick}>&lt;</span>
}


function BreadCrumbs(props) {
  const { location, onClick } = props;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const path = (location.indexOf('home') > -1) ? location.replace('/home', '') : location.substr(1);

  const handlePathClick = (path) => {
    onClick(path);
  };

  if (path === '') {
    return <span>Home</span>
  }

  const pathParts = path.split('/');
  pathParts.unshift('home');
  let constructedPath = '';
  return pathParts.map((pathPart, i) => {
    let isLast = true;
    if (i + 1 < pathParts.length) {
      isLast = false;
    }

    if (isLast && uuidRegex.test(pathPart)) {
      pathPart = 'details';
    }

    if (i > 0) {
      constructedPath += '/' + pathPart;
    }

    return (isLast)
      ? (<Fragment key={i}><span className={styles.current}>{pathPart.capitalize()}</span></Fragment>)
      : (<Fragment key={i}><span className={styles.link} onClick={handlePathClick.bind(null, constructedPath)}>{pathPart.capitalize()}</span><span className={styles.divider}>&gt;</span></Fragment>)
  });
}




class BasicLayout extends Component {
  static propTypes = {
    characters: PropTypes.any,
    getCharacters: PropTypes.func,
    goBack: PropTypes.func,
    location: PropTypes.string,
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

  handleBreadcrumbClick = (path) => {
    this.props.push(path);
  }

  handleBackClick = () => {
    this.props.goBack();
  }

  render() {
    const { location } = this.props;

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
            <div className={styles.banner}>
              <div className={styles.title}><h1>GoT Death Pool</h1></div>
              <div className={styles.quote}>I swear if they don't cover Jaime's golden hand in dragon glass to pimp slap the shit out of white walkers, then what has this all been about?</div>
            </div>
            <div className={styles.breadCrumbs}>
              <BackButton location={location} onClick={this.handleBackClick} />
              <BreadCrumbs location={location} onClick={this.handleBreadcrumbClick} />
            </div>
            <div className={styles.logo}></div>
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

const getState = (globalState) => ({
  location: globalState.router.location.pathname
});

const actions = {
  goBack,
  push
};

export default connect(getState, actions)(BasicLayout);
