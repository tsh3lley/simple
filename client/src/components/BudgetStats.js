import React, { Component } from 'react';
import { getBudgetQuery } from '../graphql/getBudgetQuery';
import { compose } from 'react-apollo';

class BudgetStats extends Component {
  render() {
    let allowed = null;
    let spent = null;
    let budgetLoading = this.props.getBudget.loading;
    if (budgetLoading) {
      allowed = <span>loading...</span>
      spent = <span>loading...</span>
    } else { 
      let { user: { budget: { amtAllowed }}} = this.props.getBudget;
      let { user: { budget: { totalSpent }}} = this.props.getBudget;
      allowed = amtAllowed
      spent = totalSpent
    }
    return (
      <div>
        <h1>Budget: {allowed}</h1>
        <h1>Spent: {spent}</h1>
        <h1>Remaining: {allowed - spent}</h1>
      </div>
    );
  }
}

export default compose (
  getBudgetQuery,
)(BudgetStats);


