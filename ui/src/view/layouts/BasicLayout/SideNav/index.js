import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import styles from './styles.module.css';

class SideNav extends Component {
  render() {
    return (
      <div className="navbar-side">
        <div className={classnames(styles.wrapper)} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.props.openSideNav}>
          <div className={classnames(styles.container, 'container')}>
            
          </div>
        </div>
        {this.props.sideNavOpen && (
          <div className={styles.overlay} onClick={this.props.closeSideNav} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    application: state.application,
    user: state.user,
    report: state.report.report
  };
}

export default connect(mapStateToProps)(SideNav);
