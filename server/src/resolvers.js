import GraphQLDate from 'graphql-date';
import { Transaction, Budget, User, PlaidItem} from './connectors';
import bluebird from 'bluebird';
import { JWT_SECRET, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, WEBHOOK_URL } from '../config';
import jwt from 'jsonwebtoken';
import plaid from 'plaid';

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
    createBudget: async (root, { budget }, context) => {
			budget.userId = context.user.id;
			const result = await Budget.create(budget);
      return result;
    },
		createTransaction: async (root, { transaction }, context) => {
			transaction.userId = context.user.id;
			transaction.date = Date.now();
			transaction.ignore = false;
			const result = await Transaction.create(transaction);
			return result;
		},
    updateTransaction: async (root, {id}, context) => {
			var t = await Transaction.findOne({where: {id: id}});
			const result = await t.update({ignore: !t.ignore})
			return result;
    },
    addPlaidItem: async (root, { token }, context) => {
      const client = new plaid.Client(
        PLAID_CLIENT_ID,
        PLAID_SECRET,
        PLAID_PUBLIC_KEY,
        plaid.environments[PLAID_ENV],
      );

      //change this shit (id: context.user.id)
      const user = await User.findOne({ where: { id: 1 }});
      const plaidResult = await client.exchangePublicToken(token);
      console.log(plaidResult);
      if (!plaidResult) {
        const msg = 'Could not exchange public_token!';
        console.log(`${msg}\n${error}`);
        return null;
      }

      const result = await PlaidItem.create({ 
        itemId: plaidResult.item_id, 
        token: plaidResult.access_token, 
        userId: user.id, 
      });

      console.log('aksaifjsgekgjelgj');
      console.log(result);

      const webhookResult = await client.updateItemWebhook(plaidResult.access_token, WEBHOOK_URL);
      console.log(webhookResult);
      return result;
    },
    refreshTransactionsWebhook: async (root, { itemId, numTransactions }) => {
      //plaid webhook hits our endpoint telling it that info has changed,
      //handle the result here
      const client = new plaid.Client(
        PLAID_CLIENT_ID,
        PLAID_SECRET,
        PLAID_PUBLIC_KEY,
        plaid.environments[PLAID_ENV],
      );

      const item = await PlaidItem.findOne({
        where: {itemId: itemId}, 
        include: User,
      });
      console.log(item.token);
      
      try { const transactions = await client.getTransactions(
        item.token, 
        '2017-07-27', 
        '2017-08-27', 
      );  } catch(err) {
        console.log(err);
      }

      console.log(transactions);
      return true;
    }
  },
};
