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
  <div>
  <button className="btn btn-link" data-toggle="modal" data-target="#exampleModalLong">Edit Budget</button>
  <div className="modal fade" id="exampleModalLong" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-body">
        <h3 style={{color: "#111"}}>Edit Budget</h3>
        <form onSubmit={handleSubmit}>
          <input
            id="budget"
            type="number"
            value={values.budget}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control"
          />
          <button className="btn btn-block btn-primary" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
  </div>
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