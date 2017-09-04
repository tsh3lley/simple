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
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
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
    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if(!channel)
        throw new Error("Channel does not exist");

      const newMessage = { id: String(nextMessageId++), text: message.text };
      channel.messages.push(newMessage);

      return newMessage;
    },
  },
};
