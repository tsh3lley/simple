import GraphQLDate from 'graphql-date';
import { Transaction, Budget, User, PlaidItem} from './connectors';
import bluebird from 'bluebird';
import { JWT_SECRET, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, WEBHOOK_URL } from '../config';
import jwt from 'jsonwebtoken';
import plaid from 'plaid';
import moment from 'moment';
import calcTotalSpent from './lib/calcTotalSpent';

const bcrypt = bluebird.promisifyAll(require('bcrypt'));

export const resolvers = {
	Date: GraphQLDate,
	Query: {
		user(root, args) {
		 	return User.findOne({where: args});
		},
	},
	User: {
    transactions(user) {
      console.log(user);
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
      await result.createBudget();
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
    createBudget: async (root, { budget: { amtAllowed }}, context) => {
      console.log(amtAllowed);
      const lastWeek = moment().subtract(7,'days').format('YYYY-MM-DD');
      //are we already using context?? if so, lit
			//budget.userId = context.user.id;
      const user = await User.findOne({ where: { id: 1 } });
      const budget = await user.getBudget();
      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: lastWeek
          },
          ignore: false
        }
      });
      const transactionsSum = calcTotalSpent(transactions);

      const result = await budget.update({ 
        amtAllowed: amtAllowed, 
        totalSpent: transactionsSum 
      });
      return result;
    },
		createTransaction: async (root, { transaction }, context) => {
			transaction.userId = context.user.id;
			transaction.date = Date.now();
			transaction.ignore = false;
			const result = await Transaction.create(transaction);
			return result;
		},
    updateTransaction: async (root, { id }, context) => {
      console.log(context);
      const lastWeek = moment().subtract(7,'days').format('YYYY-MM-DD');
			var t = await Transaction.findOne({where: {id: id}});
			const result = await t.update({ignore: !t.ignore});
      const user = await t.getUser();
      const budget = await user.getBudget();

      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: lastWeek
          },
          ignore: false
        }
      });

      const transactionsSum = calcTotalSpent(transactions);
      await budget.update({ totalSpent: transactionsSum });

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
      const user = await User.findOne({ where: { id: 1 } });
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
      console.log(result);
      const webhookResult = await client.updateItemWebhook(plaidResult.access_token, WEBHOOK_URL);
      console.log(webhookResult);
      return result;
    },
    refreshTransactionsWebhook: async (root, { itemId, numTransactions, webhookCode }) => {
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

      const user = item.user;

      const lastWeek = moment().subtract(7,'days').format('YYYY-MM-DD');
      const today = moment().format('YYYY-MM-DD');

      const result = await client.getTransactions(
        item.token, 
        lastWeek, 
        today, 
      );  

      for (var transaction of result.transactions) {
        const transAmt = parseFloat(transaction.amount);
        const transDate = moment(transaction.date).format('YYYY-MM-DD');

        let newTransaction = await user.createTransaction({
          transactionId: transaction.transaction_id,
          accountId: transaction.account_id,
          categoryId: transaction.category_id,
          type: transaction.transaction_type,
          pending: transaction.pending,
          amount: transaction.amount,
          ignore: false,
          date: transaction.date,
          name:transaction.name
        });
      }

      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: lastWeek
          },
          ignore: false
        }
      });

      const transactionsSum = calcTotalSpent(transactions);

      const budget = await user.getBudget();
      await budget.update({ totalSpent: transactionsSum });
      console.log(budget);

      return true;
    }
  },
};
