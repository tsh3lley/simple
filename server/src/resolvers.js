import GraphQLDate from 'graphql-date';
import { Transaction, Budget, User, PlaidItem} from './connectors';
import bluebird from 'bluebird';
import { JWT_SECRET, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, WEBHOOK_URL } from '../config';
import jwt from 'jsonwebtoken';
import plaid from 'plaid';
import moment from 'moment';
import { UserError } from 'graphql-errors'
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
      console.log(user);
      user.password = await bcrypt.hashAsync(user.password, 12);
      try {
        const signupUser = await User.create(user);
        await signupUser.createBudget();
        const token = jwt.sign({ id: signupUser.id }, JWT_SECRET);
        return {
          token: token
        }
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          if (error.parent.constraint === 'user_email_key') {
            throw new UserError('Email is already taken.');
          }
        }
      }
      return null;
    },
    login: async (root, { user }) => {
      //need to add context (to read token)
      console.log('it wroked')
      const loggingInUser = await User.findOne({ where: { email: user.email }});
      if (loggingInUser === null){
        throw new UserError('Invalid email');
      } 
      const result = await bcrypt.compareAsync(user.password, loggingInUser.password);
      if (result) {
        const token = jwt.sign({ id: loggingInUser.id }, JWT_SECRET);
        return {
          token: token
        }
      } else {
        throw new UserError('Invalid password') //make this ambiguous so they dont learn PW
      }
    },
    createBudget: async (root, { budget }, context) => {
      console.log(budget.amtAllowed);
      console.log('context~~~')
      const days = moment().day() - moment().day(1).day();
      //are we already using context?? if so, lit
      console.log(context);
			//budget.userId = context.user.id;
      const user = await User.findOne({ where: { id: 1 } });
      const newBudget = await user.getBudget();
      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: days
          },
          ignore: false
        }
      });
      const transactionsSum = calcTotalSpent(transactions);

      const result = await newBudget.update({ 
        amtAllowed: budget.amtAllowed, 
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
      const days = moment().day() - moment().day(1).day();  
			var t = await Transaction.findOne({where: {id: id}});
			const result = await t.update({ignore: !t.ignore});
      const user = await t.getUser();
      const budget = await user.getBudget();

      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: days
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
      console.log('webhook');
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
      const days = 30
      const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
      const today = moment().format('YYYY-MM-DD');
      console.log('2')

      const result = await client.getTransactions(
        item.token, 
        startDate, 
        today, 
      );  
      console.log('3')
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
      console.log('4')
      const transactions = await user.getTransactions({ 
        where: {
          date: {
            gt: startDate
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
