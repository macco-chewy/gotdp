import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';

class Link extends Component {
  static propTypes = {
    push: PropTypes.func,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    innerRef: PropTypes.func,
    children: PropTypes.any,
    onClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    if (props.to.state) {
      this.state = props.to.state;
    }
  }

  onClick = event => {
    const { onClick, to, push } = this.props;

    let pathString = '';
    if (typeof to === 'string') {
      pathString = to;
    } else {
      // eslint-disable-next-line
      let { pathname, search, hash } = to;

      if (search.charAt(0) !== '?') {
        search = `?${search}`;
      }

      if (hash.charAt(0) !== '#') {
        hash = `#${hash}`;
      }

      pathString = `${pathname}${search}${hash}`;
    }

    push(pathString);
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  render() {
    const { innerRef, children } = this.props;

    const passalongProps = Object.assign({}, this.props);
    delete passalongProps.push;
    delete passalongProps.to;
    delete passalongProps.innerRef;
    delete passalongProps.children;
    delete passalongProps.onClick;

    return (
      <a
        ref={(c) => { if (innerRef) { innerRef(c); } }}
        onClick={this.onClick}
        {...passalongProps}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </a>
    );
  }
}

const state = (state) => ({
  location: state.router.location,
});

const actions = {
  push,
};

export default connect(state, actions)(Link);
