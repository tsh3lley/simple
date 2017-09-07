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

input CreateTransactionInput {
  type: String!
  description: String!
  amount: Float!
}

type User {
	id: ID!
	email: String!
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

type Token {
	token: String!
}

type PlaidItem { 
	id: ID!
	token: String!
	itemId: String!
}

type Query {
	user(id: ID!): User
  	transactions(userId: ID!): [Transaction]
  	budget(userId: ID!): Budget
}

type Mutation {
	signup(user: SigninUserInput!): User
	login(user: SigninUserInput!): Token
	createBudget(budget: CreateBudgetInput!): Budget
  	createTransaction(transaction: CreateTransactionInput!): Transaction
	updateTransaction(id: ID!): Transaction
	addPlaidItem(token: String!): PlaidItem
	refreshTransactionsWebhook(itemId: String!, newTransactions: Int!): Boolean
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
