import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const getTransactionsGql = gql`
  query ($userId: ID!, $startDate: Date!) {
    getTransactions (userId: $userId, startDate: $startDate) {
      id
      amount
      name
      date
      ignore
      pending
    }
  }
`;

//TODO - figure out how to accept variables here, consider query component
const getTransactionsQuery = graphql(getTransactionsGql, {
  name: 'getTransactions',
  options: { variables: { userId: 1, startDate: "2018-11-30" }},
});

export { getTransactionsQuery };
export { getTransactionsGql };