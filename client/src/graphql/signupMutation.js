import { gql, graphql } from 'react-apollo'

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