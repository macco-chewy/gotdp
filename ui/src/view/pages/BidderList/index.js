import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import styles from './styles.module.css';


class BidderList extends Component {
  static propTypes = {
    push: PropTypes.func,
    users: PropTypes.any
  };

  handleBidderClick = (userId) => {
    this.props.push(`/bidders/${userId}`);
  }

  render() {
    const { users } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.pageHeader}>Bidders</div>
        {
          users.length === 0
            ? null
            : users.map((user, i) => {
              return (
                <div key={i} className={styles.bidderContainer} onClick={this.handleBidderClick}>
                  <div className={styles.bidderName}>{user.name}</div>
                  <div className={styles.bidderScore}>{user.attributes.score}</div>
                </div>
              )
            })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.users
});

const actions = {
  push
};

export default connect(mapStateToProps, actions)(BidderList);
