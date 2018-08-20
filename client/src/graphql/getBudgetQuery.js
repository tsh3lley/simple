import { gql, graphql } from 'react-apollo'

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
  options: { variables: { id: 1 }},
});

export { getBudgetQuery };
export { getBudgetGql };