import React, { Component } from 'react';
import { compose } from 'react-apollo';
import SignupForm from '../compoents/SignupForm';

class Signup extends Component {
  render() {
    return (
      <SignupForm />
    );
  }
}

export default Signup