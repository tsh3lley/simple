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
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const middlewareLink = new ApolloLink((operation, forward) => {
  const token = jsCookie.get(token);
  console.log(token);
    if (!_.isEmpty(token)) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token.token}`
        }
      });
/*      operation.setContext({
        headers: {
          Authorization: `Bearer ${token.token}`
        }
      });*/
    }
  return forward(operation);
});

// use with apollo-client
const link = middlewareLink.concat(httpLink);
const cache = new InMemoryCache();

const client = new ApolloClient({ cache, link });

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
