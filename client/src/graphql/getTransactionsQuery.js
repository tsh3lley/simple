import { gql, graphql } from 'react-apollo'

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

const getTransactionsQuery = graphql(getTransactionsGql, {
  name: 'getTransactions',
  options: { variables: { id: 1 }},
});

export { getTransactionsQuery };
export { getTransactionsGql };