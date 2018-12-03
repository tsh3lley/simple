import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const getTransactionsGql = gql`
  query {
    getTransactions {
      id
      amount
      name
      date
      ignore
      pending
    }
  }
`;

const getTransactionsQuery = graphql(getTransactionsGql, { name: 'getTransactions' });

export { getTransactionsQuery };
export { getTransactionsGql };