import React, { Component } from 'react';
import { getBudgetQuery } from '../graphql/getBudgetQuery';
import { compose } from 'react-apollo';

class BudgetStats extends Component {
  render() {
    let amountAllowed = null;
    let totalSpent = null;
    let budgetLoading = this.props.getBudget.loading;
    if (budgetLoading) {
      amountAllowed = <span>loading...</span>
      totalSpent = <span>loading...</span>
    } else { 
      amountAllowed = this.props.getBudget.user.budget.amtAllowed;
      totalSpent = this.props.getBudget.user.budget.totalSpent;
    }
    return (
      <div>
        <h1>Budget: {amountAllowed}</h1>
        <h1>Spent: {totalSpent}</h1>
        <h1>Remaining: {amountAllowed - totalSpent}</h1>
      </div>
    );
  }
}

export default compose (
  getBudgetQuery,
)(BudgetStats);


