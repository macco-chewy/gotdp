import React, { Component } from 'react';
import { connect } from 'react-redux';

import BasicLayout from 'view/layouts/BasicLayout';

class Home extends Component {
  render() {
    return (
      <BasicLayout>We are home!</BasicLayout>
    );
  }
}

const getState = (globalState) => ({});
const actions = {};
export default connect(getState, actions)(Home);
