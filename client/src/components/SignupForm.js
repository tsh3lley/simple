import PropTypes from 'prop-types';
import Yup from 'yup';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import { Formik } from 'formik';
import { compose } from 'react-apollo';
import React, { Component } from 'react';
import jsCookie from 'js-cookie';
import { signupMutation } from '../graphql/signupMutation';
import { loginMutation } from '../graphql/loginMutation';

const SignupForm = (props) => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='form-label'>
          First name
        </label>
        <input
          name='firstName'
          type='text'
          value={values.firstName}
          onChange={handleChange}
          className={classNames('form-input', { 'is-error': errors.firstName })} />
        <label className='form-label'>
          Last name
        </label>
        <input
          name='lastName'
          type='text'
          value={values.lastName}
          onChange={handleChange}
          className={classNames('form-input', { 'is-error': errors.lastName })} />
        <label className='form-label'>
          Email
        </label>
        <input
          name='email'
          type='text'
          value={values.email}
          onChange={handleChange}
          className={classNames('form-input', { 'is-error': errors.email })} />
        <label className='form-label'>
          Password
        </label>
        <input
          name='password'
          type='password'
          value={values.password}
          onChange={handleChange}
          className={classNames('form-input', { 'is-error': errors.password })} />
        <button
          type='submit'
          className='btn btn-primary w-100 mt-3'
          disabled={isSubmitting}>
          Sign up
        </button>
      </div>
      <div className='pt-1 text-center'>
        <span>Have an account? <Link to='/login'><a>Login</a></Link></span>
      </div>
    </form>
  );
};

SignupForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  dirty: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired
};

export default compose(
  loginGraphql,
  createUserGraphql,
  Formik({
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address.')
        .required('Email is required.'),
      firstName: Yup.string()
        .required('First name is required.'),
      lastName: Yup.string()
        .required('Last name is required.'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .required('Password is required.')
    }),
    handleSubmit: async (values, { props: { createUser, login }, setSubmitting, setErrors }) => {
      try {
        await createUser({
          input: values
        });
        const result = await login({
          variables: {
            email: values.email,
            password: values.password
          }
        });
        const { token } = result.data.login;
        jsCookie.set('token', token);
        window.location.href = '/';
        setSubmitting(false);
      } catch (error) {
        if (error.message === 'GraphQL error: Your email already has an account.') {
          setErrors({ email: 'That email has already been registered.' });
          setSubmitting(false);
        }
      }
    },
    displayName: 'SignupForm'
  })
)(SignupForm);
