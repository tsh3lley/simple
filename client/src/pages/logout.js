import React, { Component } from 'react';
import { withApollo, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import jsCookie from 'js-cookie';

class Logout extends Component {
  async componentDidMount() {
    const { client, history } = this.props;
    jsCookie.remove('token');
    await client.resetStore();
    history.push('/login');
  }
  render() {
    return <div />;
  }
}

export default compose(
  withApollo,
  withRouter
)(Logout);
