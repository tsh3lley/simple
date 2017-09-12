import { gql, graphql } from 'react-apollo'

const addPlaidItemGql = gql`
  mutation addPlaidItem($token: String!) {
    addPlaidItem(token: $token) {
      id
    }
  }
`;

const addPlaidItemMutation = graphql(addPlaidItemGql);

export { addPlaidItemGql };
export { addPlaidItemMutation };