import GraphQLDate from 'graphql-date';
import { Transaction, Budget, User } from './connectors';
import bluebird from 'bluebird';
import { JWT_SECRET } from '../config'
import jwt from 'jsonwebtoken'

const bcrypt = bluebird.promisifyAll(require('bcrypt'));

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

  Mutation: {
    signup: async (root, { user }) => {
      user.password = await bcrypt.hashAsync(user.password, 12);
      const result = await User.create(user);
      return result;
    },
    login: async (root, { user }) => {
      const loggingInUser = await User.findOne({ where: { email: user.email }});
      const result = await bcrypt.compareAsync(user.password, loggingInUser.password);
      if (result) {
        const token = jwt.sign({ id: loggingInUser.id }, JWT_SECRET);  
        return {
          token: token
        }
      }
      return null;
    },
    createBudget: (root, args, context) => {
      console.log(context.user.id);
      return null;
    },
    updateTransaction: (root, args) => {

    },
  },
};
