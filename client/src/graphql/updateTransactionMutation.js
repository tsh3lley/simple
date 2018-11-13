import { graphql } from 'react-apollo'
import gql from 'graphql-tag';
import { getBudgetGql } from '../graphql/getBudgetQuery';

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
      query: getBudgetGql,
      variables: { id: 1 },
    }]
  }

});

export { updateTransactionMutation };
export { updateTransactionGql };