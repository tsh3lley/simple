import Sequelize from 'sequelize';

const db = new Sequelize('simple', null, null, {
  dialect: 'sqlite',
  storage: './simple.sqlite',
  logging: false,
});

const BudgetModel = db.define('budget', {
  amtAllowed: { type: Sequelize.STRING },
});

const TransactionModel = db.define('transaction', {
  transactionId: { type: Sequelize.STRING },
  accountId: { type: Sequelize.STRING },
  category: { type: Sequelize.STRING },
  categoryId: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING }, // cash (entered by user) or one of the plaid types
  pending: { type: Sequelize.BOOLEAN },
  amount: { type: Sequelize.FLOAT },
  ignore: { type: Sequelize.BOOLEAN },
  date: { type: Sequelize.DATE },
});

const UserModel = db.define('user', {
  email: { type: Sequelize.STRING, unique: true },
  name: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

// a plaid item is a user's bank object
// ex. one user can have a PNC item and a BoA item
const PlaidItemModel = db.define('plaidItem', {
  itemId: { type: Sequelize.STRING },
  token: { type: Sequelize.STRING },
})

BudgetModel.belongsTo(UserModel);

TransactionModel.belongsTo(UserModel);

PlaidItemModel.belongsTo(UserModel);

const Transaction = db.models.transaction;
const Budget = db.models.budget;
const User = db.models.user;
const PlaidItem = db.models.plaidItem;

export { Transaction, Budget, User, PlaidItem, db};