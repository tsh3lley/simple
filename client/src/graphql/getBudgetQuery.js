import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const getBudgetGql = gql`
  query ($id: ID!) {
    user(id: $id) {
      budget{
        id
        amtAllowed
        totalSpent
      }
    }
  }
`;

const getBudgetQuery = graphql(getBudgetGql, {
  name: 'getBudget',
  options: { variables: { id: 69 }},
});

export { getBudgetQuery };
export { getBudgetGql };