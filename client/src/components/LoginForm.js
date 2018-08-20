import PropTypes from 'prop-types';
import Yup from 'yup';
import classNames from 'classnames';
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie';
import { Formik } from 'formik';
import { Route, Redirect } from 'react-router'
import { compose, withApollo } from 'react-apollo';
import { loginMutation } from '../graphql/loginMutation';

const LoginForm = ({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit
}) => (
  <form onSubmit={handleSubmit}>
    <div className='form-group'>
      <label className='form-label'>
        Email
      </label>
      <input
        name='email'
        className={classNames('form-input', { 'is-error': errors.email })}
        type='text'
        value={values.email}
        onChange={handleChange} />
      <label className='form-label'>
        Password
      </label>
      <input
        name='password'
        className={classNames('form-input', { 'is-error': errors.password })}
        type='password'
        value={values.password}
        onChange={handleChange} />
      {errors.graphQLErrors ? <div className='text-error mt-3'>{errors.graphQLErrors[0].message}</div> : ''}
      <button
        className='btn btn-primary w-100 mt-3'
        type='submit'
        disabled={isSubmitting}>
        Login
      </button>
    </div>
    <div className='pt-1 text-center'>
      <span>Don&#39;t have an account? <Link to='/signup'><a>Signup</a></Link></span>
    </div>
  </form>
);

LoginForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  dirty: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

export default compose(
  withApollo,
  loginMutation,
  Formik({
    handleSubmit: async (values, { props: { login, client }, setErrors, setSubmitting }) => {
      console.log(values);
      const { email, password } = values;
      try {
        const result = await login({
          variables: {
            user: {
              email,
              password
            }
          }
        });
        const { data: { login: { token } } } = result;
        jsCookie.set('token', token);
        await client.resetStore();
        console.log('jews');
        //redirect({}, '/'); need to redirect
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  })
)(LoginForm);