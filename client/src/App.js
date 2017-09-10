import './App.css';
import PlaidLink from 'react-plaid-link';
import React, { Component } from 'react';
import { 
  gql,
  compose,
  graphql,
} from 'react-apollo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plaidItem: null,
      loginPage:[],
      uploadScreen:[],
      transactions:[]
    }
  }

  async handleOnSuccess(token, metadata) {
    // returns public_token, which will expire in 30 minutes
    // send the public_token to the server and exchange it there for an access_token
    const plaidItem = await this.props.mutate({ variables: { token: token }});
    this.setState({ plaidItem });
  }

  async refreshData() {
    this.props.data.refetch();
  }

  render() {
    let transactionsTable = null;
    const { data: { loading } } = this.props;
    if (loading) {
      transactionsTable = <h1>loading...</h1>
    } else { 
      const { data: { user: { transactions } } } = this.props;
      transactionsTable = (
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>amount</th>
              <th>ignore</th>
              <th>pending</th>
              <th>date</th>
              <th>id</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.name}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.ignore ? 'true' : 'false'}</td>
                <td>{transaction.pending ? 'true' : 'false'}</td>
                <td>{transaction.date}</td>
                <td>{transaction.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) 

    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to the white house mr obama</h2>
        </div>
        <PlaidLink
          publicKey="0de01812c4e3a7cb3b56cd17d7b9cd"
          product="auth"
          env="sandbox"
          clientName="SimpleBudget"
          onSuccess={(token, metadata) => this.handleOnSuccess(token,metadata)}
        />
        <div>
          {JSON.stringify(this.state.plaidItem)}
        </div>
        <button onClick={() => this.refreshData()}> Refresh Data </button>
        <div>{transactionsTable}</div>
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

const getTransactionsQuery = gql`
  query ($id: ID!) {
    user(id: $id) {
      transactions{
        id
        amount
        name
        date
        ignore
        pending
      }
    }
  }
`;

//change User ID use context.user.id
export default compose (
  graphql(addPlaidItemMutation),
  graphql(getTransactionsQuery, {
    options: { variables: { id: 1 } },
  })
)(App);
