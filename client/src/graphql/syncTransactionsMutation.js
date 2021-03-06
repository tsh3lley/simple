import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const syncTransactionsGql = gql`
    mutation($userId: ID!) {
      syncTransactions(userId: $userId) {
        transactionId
      }
    }
  `

const syncTransactionsMutation = graphql(syncTransactionsGql, { name: 'syncTransactions' });

export { syncTransactionsGql };
export { syncTransactionsMutation };