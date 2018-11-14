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
      <div className="stats">
        <div className="container">
          <div className="row">
            <div className="col-4">Budget: ${Math.round(allowed).toLocaleString()}</div>
            <div className="col-4">Spent: ${Math.round(spent).toLocaleString()}</div>
            <div className="col-4">Remaining: ${Math.round(allowed - spent).toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose (
  getBudgetQuery,
)(BudgetStats);


