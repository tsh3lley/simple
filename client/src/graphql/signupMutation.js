import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const signupGql = gql`
  mutation($user: SigninUserInput!) {
    signup(user: $user) {
      token
    }
  }
`;

const signupMutation = graphql(signupGql, { name: 'signup' });

export { signupGql };
export { signupMutation };