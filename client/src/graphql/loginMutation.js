import { gql, graphql } from 'react-apollo'

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