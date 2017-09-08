import './App.css';
import PlaidLink from 'react-plaid-link';
import LoginScreen from './Loginscreen';
import UploadScreen from './UploadScreen';
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { 
  gql,
  compose,
  graphql,
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plaidItem: null,
      loginPage:[],
      uploadScreen:[],
      transactions: {}
    }
  }

  /*
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<LoginScreen appContext={this}/>);
    this.setState({loginPage:loginPage})
  }
  */

  async handleOnSuccess(token, metadata) {
    // returns public_token, which will expire in 30 minutes
    // send the public_token to the server and exchange it there for an access_token
    const plaidItem = await this.props.mutate({ variables: { token: token }});
    this.setState({ plaidItem });
  }

  async refreshData() {
    console.log(this.props.data);
    /*const allTransactions = await this.props.mutate({  })
    const transactions = allTransactions.map((transaction) =>
      <li>{transaction}</li>
    );
    */
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
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
          onSuccess={(token, metadata) => this.handleOnSuccess(token,metadata)}
        />
        <div>
          {JSON.stringify(this.state.plaidItem)}
        </div>
        <button onClick={() => this.refreshData()}> Refresh Data </button>
        
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
  query getTransactions($id: ID!) {
    transactions(userId: $id){Transaction}
  }
`;

//change User ID use context.user.id
export default compose (
  graphql(addPlaidItemMutation),
  graphql(getTransactionsQuery, {
    options: { variables: { userId: 1 } },
  })
)(App);
