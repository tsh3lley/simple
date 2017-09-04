import GraphQLDate from 'graphql-date';
import { Transaction, Budget, User } from './connectors';

export const resolvers = {
	Date: GraphQLDate,
	Query: {
		user(root, args) {
		 	return User.findOne({where: args});
		},
		transactions(root, args) {
			return Transaction.findAll({
        where: args,
        order: [['date', 'DESC']],
      });
		},
		budget(root, args) {
			return Budget.findOne({where: args});
		},
	},
	User: {
    transactions(user) {
    	return Transaction.findAll({
	      where: { userId: user.id },
	      order: [['date', 'DESC']],
      });
    },
    budget(user) {
    	return user.getBudget();
    },
	},

	// this is probably wrong
  Mutation: {
    signup: (root, args) => {

    },
    login: (root, args) => {

    },
    createBudget: (root, args) => {
    	const newBudget = { id: }
    },
    updateTransaction: (root, args) => {
    	return Transaction.update
    },
  },
};
