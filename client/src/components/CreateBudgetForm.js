import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Yup from 'yup';
import { compose } from 'react-apollo';
import { createBudgetMutation } from '../graphql/createBudgetMutation';

const CreateBudgetForm = ({
  values,
  touched,
  errors,
  dirty,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}) => (
  <form onSubmit={handleSubmit}>
    <label htmlFor="budget">Budget</label>
    <input
      id="budget"
      placeholder="Weekly Budget Amount"
      type="number"
      value={values.budget}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    <button type="submit" disabled={isSubmitting}>
      Submit
    </button>
  </form>
);

CreateBudgetForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  dirty: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default compose(
  createBudgetMutation,
  Formik({
    mapPropsToValues: props => ({
      budget: props.budget,
    }),
    validationSchema: Yup.object().shape({
      budget: Yup.number().positive().required('Enter a budget'),
    }),
    handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
      await props.createBudget({ variables: { budget: { amtAllowed: values.budget } } });
      setSubmitting(false);
    },
  })
)(CreateBudgetForm);