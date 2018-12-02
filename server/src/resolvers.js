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
		user(root, args, context) {
		 	return User.findOne({
        where: { id: context.user.id }
      });
		},
    getTransactions(root, args, context) {
      const { userId, startDate } = args;
      console.log(context);
      return Transaction.findAll({
        where: { 
          userId: userId,
          date: { 
            gt: startDate
          } 
        },
        order: [['date', 'DESC']],
      });
    }
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
      const days = moment().day() - moment().day(1).day();
      const user = await User.findOne({ where: { id: context.user.id } });
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
      const relevantTransactions = await user.getTransactions({ 
        where: {
          date: {
            gt: days
          },
          ignore: false
        }
      });
      const transactionsSum = calcTotalSpent(relevantTransactions);
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
      const user = await User.findOne({ where: { id: context.user.id } });
      const plaidResult = await client.exchangePublicToken(token);
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
      const webhookResult = await client.updateItemWebhook(plaidResult.access_token, WEBHOOK_URL);
      return result;
    },
    syncTransactions: async (root, { userId }, context) => {
      const client = new plaid.Client(
        PLAID_CLIENT_ID,
        PLAID_SECRET,
        PLAID_PUBLIC_KEY,
        plaid.environments[PLAID_ENV],
      );
      console.log(client)
      //consider passing user in intead of userid
      const user = await User.findOne({
        where: { id: userId }
      });
      //include plaid items in user query above and delete this
      const item = await PlaidItem.findOne({
        where: {userId: userId}, 
        include: User,
      });
      const days = 7
      const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
      const today = moment().format('YYYY-MM-DD');
      //this will get all transactions across all items
      const result = await client.getTransactions(
        item.token,
        startDate, 
        today, 
      );  
      console.log('token ' + item.token)
      for (var transaction of result.transactions) {
        const existingTransaction = await Transaction.findOne({
          where: { transactionId: transaction.transaction_id }
        });
        if (existingTransaction) {
          continue;
        } else {
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
      }
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
      //todo: return something useful lol
      console.log('transactions 0 ' + transactions[0])
      return transactions[0];
    }
  },
};
