import '../styles/App.css';
import PlaidLink from 'react-plaid-link';
import React, { Component } from 'react';
import { addPlaidItemMutation } from '../graphql/addPlaidItemMutation';
import CreateBudgetForm from './CreateBudgetForm';
import TransactionsTable from './TransactionsTable';
import BudgetStats from './BudgetStats';
import { compose } from 'react-apollo';
import Footer from './Footer';

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

  render() {
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
          <CreateBudgetForm />
          <BudgetStats />
        </div>
        <TransactionsTable />
        <Footer />
      </div>
    );
  }
}

//change User ID use context.user.id
export default compose (
  addPlaidItemMutation,
)(App);
