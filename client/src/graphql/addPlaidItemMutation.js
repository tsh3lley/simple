import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const addPlaidItemGql = gql`
  mutation addPlaidItem($token: String!) {
    addPlaidItem(token: $token) {
      id
    }
  }
`;

const addPlaidItemMutation = graphql(addPlaidItemGql, { name: 'addPlaidItem' });

export { addPlaidItemGql };
export { addPlaidItemMutation };