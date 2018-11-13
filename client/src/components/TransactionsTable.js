import React, { Component } from 'react';
import { getTransactionsQuery } from '../graphql/getTransactionsQuery'
import { updateTransactionMutation }  from '../graphql/updateTransactionMutation';
import { compose } from 'react-apollo';

class TransactionsTable extends Component {

  async refreshData() {
    this.props.getTransactions.refetch();
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
      const { user: { transactions } } = this.props.getTransactions;
      transactionsTable = (
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>amount</th>
              <th>ignore</th>
              <th>pending</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} onClick={(transactionId) => this.ignoreTransaction(transaction.id)}>
                <td>{transaction.name}</td>
                <td>${Math.round(transaction.amount).toLocaleString()}</td>
                <td>{transaction.ignore ? 'true' : 'false'}</td>
                <td>{transaction.pending ? 'true' : 'false'}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) 
    }
    return (
      <div>
        <button onClick={() => this.refreshData()}> Refresh Data </button>
        <div className="transactionsTable">{transactionsTable}</div>
      </div>
    );
  }
}

export default compose (
  getTransactionsQuery,
  updateTransactionMutation,
)(TransactionsTable);
