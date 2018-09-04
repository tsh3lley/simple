import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jsCookie from 'js-cookie';
import PropTypes from 'prop-types';

const isLoggedIn = () => {
  const token = jsCookie.get('token');
  return token ? true : false 
}

const AuthorizedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
    isLoggedIn() ? (
      <Component {...props} />
    ) : (
      <Redirect to='/login' />
    )
  )} />
);

AuthorizedRoute.propTypes = {
  component: PropTypes.any.isRequired
};

export default AuthorizedRoute;