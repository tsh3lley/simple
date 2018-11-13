import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom'
import jsCookie from 'js-cookie';
import { Formik } from 'formik';
import { compose, withApollo } from 'react-apollo';
import { signupMutation } from '../graphql/signupMutation';

const SignupForm = ({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit
}) => {
  const loggedIn = jsCookie.get('token');
  if (!loggedIn) {
    return (
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
            Signup
          </button>
        </div>
        <div className='pt-1 text-center'>
          <span>Already have an account? <Link to='/login'>Login</Link></span>
        </div>
      </form>
    );
  } else return <Redirect to='/' />
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
  handleReset: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

export default compose(
  withApollo,
  withRouter,
  signupMutation,
  Formik({
    handleSubmit: async (values, { props: { signup, client, history }, setErrors, setSubmitting }) => {
      const { email, password } = values;
      try {
        const result = await signup({
          variables: {
            user: {
              email,
              password
            }
          }
        });
        const { data: { signup: { token } } } = result;
        jsCookie.set('token', token);
        await client.resetStore();
        history.push('/');
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  })
)(SignupForm);