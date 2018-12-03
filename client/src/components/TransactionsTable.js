import React, { Component } from 'react';
import { getTransactionsQuery } from '../graphql/getTransactionsQuery'
import { updateTransactionMutation }  from '../graphql/updateTransactionMutation';
import { syncTransactionsMutation } from '../graphql/syncTransactionsMutation';
import { compose } from 'react-apollo';
import moment from 'moment';

class TransactionsTable extends Component {

  async refreshData() {
    this.props.getTransactions.refetch();
    this.props.getTransactions;
  }

  async ignoreTransaction(transactionId) {
    await this.props.updateTransaction({ variables: { id: transactionId }});
  }

  render() {
    let transactionsTable = null;
    let transactionsLoading = this.props.getTransactions.loading;
    if (transactionsLoading) {
      transactionsTable = <h1>loading...</h1>
    } else { 
      const transactions = this.props.getTransactions.getTransactions;
      transactionsTable = (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} onClick={(transactionId) => this.ignoreTransaction(transaction.id)}
                className={transaction.ignore ? 'ignored' : null}>
                <td>{transaction.pending ? '(Pending) ' : ''}{transaction.name}</td>
                <td>${Math.round(transaction.amount).toLocaleString()}</td>
                <td>{moment(transaction.date).add(8,'hour').format("MMMM D, YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) 
    }
    return (
      <div className="container">
        <div className="transactionsTable">{transactionsTable}</div>
        <button style={{display: "block", margin: "0 auto"}} className="btn btn-dark" onClick={() => this.refreshData()}>Refresh Data</button>
      </div>
    );
  }
}

export default compose (
  syncTransactionsMutation,
  getTransactionsQuery,
  updateTransactionMutation,
)(TransactionsTable);
