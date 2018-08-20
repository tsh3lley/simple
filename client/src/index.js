import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import jsCookie from 'js-cookie';
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from './pages/login'
import { 
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });

// networkInterface.use([{
//   applyMiddleware(req, next) {
//     if (!req.options.headers) {
//       req.options.headers = {}
//     }
//     const token = jsCookie.get(token);
//     req.options.headers.authorization = token ? `Bearer ${token}` : null
//     next();
//   }
// }]);

const client = new ApolloClient({ networkInterface: networkInterface });

ReactDOM.render(
  <ApolloProvider client = {client}>
    <BrowserRouter>      
      <Switch>
        <Route exact path='/' component={App}/>
        <Route exact path='/login' component={Login}/>
      </Switch>
    </BrowserRouter>
  </ApolloProvider>, 
  document.getElementById('root')
);

registerServiceWorker();
