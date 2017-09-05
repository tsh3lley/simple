import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlaidLink from 'react-plaid-link';
import { 
  gql,
  graphql,
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plaidItem: null,
    }
  }

  async handleOnSuccess(token, metadata) {
    // returns public_token, which will expire in 30 minutes
    // send the public_token to the server and exchange it there for an access_token
    console.log(token, metadata);
    console.log(this.props);
    const plaidItem = await this.props.mutate({ variables: { token: token }});
    this.setState({ plaidItem });
    //graphql query here
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <PlaidLink
          publicKey="0de01812c4e3a7cb3b56cd17d7b9cd"
          product="auth"
          env="sandbox"
          clientName="SimpleBudget"
          onSuccess={(token,metadata) => this.handleOnSuccess(token,metadata)}
        />
        <div>
          {JSON.stringify(this.state.plaidItem)}
        </div>
      </div>
    );
  }
}

const addPlaidItemMutation = gql`
  mutation addPlaidItem($token: String!) {
    addPlaidItem(token: $token) {
      id
    }
  }
`;

export default graphql(addPlaidItemMutation)(App);