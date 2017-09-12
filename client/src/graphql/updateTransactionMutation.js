import { gql, graphql } from 'react-apollo'

const updateTransactionGql= gql`
  mutation updateTransaction($id: ID!) {
    updateTransaction(id: $id) {
      ignore
    }
  }
`;

const updateTransactionMutation = graphql(updateTransactionGql);

export { updateTransactionMutation };
export { updateTransactionGql };