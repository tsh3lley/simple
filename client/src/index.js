import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import jsCookie from 'js-cookie';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import PageNotFound from './components/PageNotFound';
import AuthorizedRoute from './lib/AuthorizedRoute';
import _ from 'lodash';
import { 
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = jsCookie.get(token);
    if (!_.isEmpty(token)) {
      req.options.headers.Authorization = `Bearer ${token.token}`
    }
    next();
  }
}]);

const client = new ApolloClient({ networkInterface: networkInterface });

ReactDOM.render(
  <ApolloProvider client = {client}>
    <BrowserRouter>      
      <Switch>
        <AuthorizedRoute exact path='/' component={App}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/signup' component={Signup}/>
        <Route component={PageNotFound}/>
      </Switch>
    </BrowserRouter>
  </ApolloProvider>, 
  document.getElementById('root')
);

registerServiceWorker();
