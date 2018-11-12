import { gql, graphql } from 'react-apollo'
import { getBudgetQuery } from '../graphql/getBudgetQuery';

const updateTransactionGql= gql`
  mutation($id: ID!) {
    updateTransaction(id: $id) {
      id
      ignore
    }
  }
`;

const updateTransactionMutation = graphql(updateTransactionGql, {
  name: 'updateTransaction',
  options: {
    refetchQueries: [{
      query: getBudgetQuery
    }]
  }
});

export { updateTransactionMutation };
export { updateTransactionGql };