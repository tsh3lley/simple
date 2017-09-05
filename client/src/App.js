import './App.css';
import PlaidLink from 'react-plaid-link';
import LoginScreen from './Loginscreen';
import UploadScreen from './UploadScreen';
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { 
  gql,
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
      uploadScreen:[]
    }
  }

  componentWillMount(){
    var loginPage =[];
    loginPage.push(<LoginScreen appContext={this}/>);
    this.setState({loginPage:loginPage})
  }

  async handleOnSuccess(token, metadata) {
    // returns public_token, which will expire in 30 minutes
    // send the public_token to the server and exchange it there for an access_token
    console.log(token, metadata);
    console.log(this.props);
    const plaidItem = await this.props.mutate({ variables: { token: token }});
    this.setState({ plaidItem });
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
          onSuccess={(token,metadata) => this.handleOnSuccess(token,metadata)}
        />
        <div>
          {JSON.stringify(this.state.plaidItem)}
        </div>
        {this.state.loginPage}
        {this.state.uploadScreen}
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
