import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
scalar Date

input SigninUserInput {
	email: String!
	password: String!
	name: String
}

input CreateBudgetInput {
	amtAllowed: Float!
}

type User {
	id: ID!
	email: ID!
	name: String!
	budget: Budget
	transactions: [Transaction]
	jwt: String
}

type Transaction {
	id: ID!
	type: String!
	description: String!
	amount: Float!
	ignore: Boolean!
	date: Date!
}

type Budget {
	id: ID!
	amtAllowed: Float!
	amtRemaining: Float!
}

type Query {
	user(id: ID!): User 
  	transactions(userId: ID!): [Transaction]
  	budget(userId: ID!): Budget
}

type Mutation {
	signup(user: SigninUserInput!): User
	login(user: SigninUserInput!): User
	createBudget(budget: CreateBudgetInput!): Budget
	updateTransaction(id: ID!): Transaction
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };