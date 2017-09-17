import './App.css';
import PlaidLink                      from 'react-plaid-link';
import React, { Component }           from 'react';
import { updateTransactionMutation }  from './graphql/updateTransactionMutation';
import { addPlaidItemMutation }       from './graphql/addPlaidItemMutation';
import { createBudgetMutation }       from './graphql/createBudgetMutation';
import { getTransactionsQuery }       from './graphql/getTransactionsQuery';
import { getBudgetQuery }             from './graphql/getBudgetQuery';
import { compose }                    from 'react-apollo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plaidItem: null,
      transactions:[]
    }
  }

  async handleOnSuccess(token, metadata) {
    // returns public_token, which will expire in 30 minutes
    // send the public_token to the server and exchange it there for an access_token
    const plaidItem = await this.props.addPlaidItem({ variables: { token: token }});
    this.setState({ plaidItem });
  }

  async refreshData() {
    this.props.getTransactions.refetch();
  }

  async ignoreTransaction(transactionId) {
    await this.props.updateTransaction({ variables: { id: transactionId }});
  }

  async updateBudget(event) {
    await this.props.createBudget({ variables: { budget: { amtAllowed: event.target.value } } });
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
                <td>{transaction.amount}</td>
                <td>{transaction.ignore ? 'true' : 'false'}</td>
                <td>{transaction.pending ? 'true' : 'false'}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) 
    }
    let amountAllowed = null;
    let totalSpent = null;
    let budgetLoading = this.props.getBudget.loading;
    if (budgetLoading) {
      amountAllowed = <h1>loading...</h1>
      totalSpent = <h1>loading...</h1>
    } else { 
      amountAllowed = this.props.getBudget.user.budget.amtAllowed;
      totalSpent = this.props.getBudget.user.budget.totalSpent;
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>SimpleBudget</h2>
        </div>
        <PlaidLink
          publicKey="0de01812c4e3a7cb3b56cd17d7b9cd"
          product="auth"
          env="sandbox"
          clientName="SimpleBudget"
          onSuccess={(token, metadata) => this.handleOnSuccess(token,metadata)}
        />
        <div>
          <form className="budgetInput" onSubmit={(event) => this.updateBudget(event)}>
            <label>
              Budget:
              <input type="text" name="bugetAmount"/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
          <h1>Budget: {amountAllowed}</h1>
          <h1>Spent: {totalSpent}</h1>
          <h1>Remaining: {amountAllowed - totalSpent}</h1>
        </div>
        <div>
          {JSON.stringify(this.state.plaidItem)}
        </div>
        <button onClick={() => this.refreshData()}> Refresh Data </button>
        <div className="transactionsTable">{transactionsTable}</div>
      </div>
    );
  }
}

//change User ID use context.user.id
export default compose (
  addPlaidItemMutation,
  updateTransactionMutation,
  createBudgetMutation,
  getTransactionsQuery,
  getBudgetQuery,
)(App);
