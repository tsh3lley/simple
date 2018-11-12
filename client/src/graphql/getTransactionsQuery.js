import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const getTransactionsGql = gql`
  query ($id: ID!) {
    user(id: $id) {
      transactions{
        id
        amount
        name
        date
        ignore
        pending
      }
    }
  }
`;

//TODO - fix this so ID is not hardcoded - use context instead of variables
const getTransactionsQuery = graphql(getTransactionsGql, {
  name: 'getTransactions',
  options: { variables: { id: 1 }},
});

export { getTransactionsQuery };
export { getTransactionsGql };