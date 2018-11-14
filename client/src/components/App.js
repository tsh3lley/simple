import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import PlaidLink from 'react-plaid-link';
import React, { Component } from 'react';
import { addPlaidItemMutation } from '../graphql/addPlaidItemMutation';
import CreateBudgetForm from './CreateBudgetForm';
import TransactionsTable from './TransactionsTable';
import BudgetStats from './BudgetStats';
import { compose } from 'react-apollo';
import Footer from './Footer';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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
          <div className="container">
            <div className="row">
              <div className="col-4">
                <CreateBudgetForm />
              </div>
              <div className="col-4">
                <h2 className="title">SimpleBudget</h2>
              </div>
              <div className="col-4">
                <PlaidLink
                  publicKey="0de01812c4e3a7cb3b56cd17d7b9cd"
                  product="auth"
                  env="sandbox"
                  clientName="SimpleBudget"
                  onSuccess={(token, metadata) => this.handleOnSuccess(token,metadata)}
                  className="btn btn-link" 
                  style={{}}/>
              </div>
            </div>
          </div>
        </div>
        <BudgetStats />
        <TransactionsTable />
        <Footer />
      </div>
    );
  }
}

export default compose (
  addPlaidItemMutation,
)(App);
