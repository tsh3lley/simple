import { gql, graphql } from 'react-apollo'

const createBudgetGql = gql`
  mutation createBudget($budget: CreateBudgetInput!) {
    createBudget(budget: $budget) {
      amtAllowed
      totalSpent
    }
  }
`;

const createBudgetMutation = graphql(createBudgetGql, { name: 'createBudget' });

export { createBudgetGql };
export { createBudgetMutation };