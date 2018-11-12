import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const loginGql = gql`
  mutation ($user: SigninUserInput!) {
    login(user: $user) {
      token
    }
  }
`;

const loginMutation = graphql(loginGql, { name: 'login' });

export { loginGql };
export { loginMutation };