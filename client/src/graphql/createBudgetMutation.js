import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const createBudgetGql = gql`
  mutation createBudget($budget: CreateBudgetInput!) {
    createBudget(budget: $budget) {
      id
      amtAllowed
      totalSpent
    }
  }
`;

const createBudgetMutation = graphql(createBudgetGql, { name: 'createBudget' });

export { createBudgetGql };
export { createBudgetMutation };