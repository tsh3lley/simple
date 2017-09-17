import React, { Component } from 'react';
import { compose } from 'react-apollo';
import LoginForm from './LoginForm';

class Login extends Component {
  render() {
    return (
      <LoginForm />
    );
  }
}

export default Login;