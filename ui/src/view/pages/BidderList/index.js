import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';

import LeaderBoard from 'view/components/LeaderBoard';
import PageHeader from 'view/components/PageHeader';

import styles from './styles.module.css';


class BidderList extends Component {
  static propTypes = {
    push: PropTypes.func,
    users: PropTypes.any
  };

  handleBidderClick = (name) => {
    this.props.push(`/bidders/${name}`);
  }

  render() {
    const { users } = this.props;

    return (
      <div className={styles.root}>
        <PageHeader legend="rank">Leader Board</PageHeader>
        <LeaderBoard users={users} onClick={this.handleBidderClick} />
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
