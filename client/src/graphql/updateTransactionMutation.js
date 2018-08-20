import { gql, graphql } from 'react-apollo'

const updateTransactionGql= gql`
  mutation($id: ID!) {
    updateTransaction(id: $id) {
      id
      ignore
    }
  }
`;

const updateTransactionMutation = graphql(updateTransactionGql, { name: 'updateTransaction' });

export { updateTransactionMutation };
export { updateTransactionGql };