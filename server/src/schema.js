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
	transactionId: String!
	accountId: String!
	category: String!
	categoryId: String!
	type: String!
	pending: Boolean!
	amount: Float!
	ignore: Boolean!
	date: Date!
	name: String!
}

type Budget {
	id: ID!
	amtAllowed: Float!
	totalSpent: Float!
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
}

type Mutation {
	signup(user: SigninUserInput!): Token
	login(user: SigninUserInput!): Token
	createBudget(budget: CreateBudgetInput!): Budget
  createTransaction(transaction: CreateTransactionInput!): Transaction
	updateTransaction(id: ID!): Transaction
	addPlaidItem(token: String!): PlaidItem
	syncTransactions(userId: ID!): Transaction
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
