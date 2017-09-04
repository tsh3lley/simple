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
  type: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  amount: { type: Sequelize.FLOAT },
  ignore: { type: Sequelize.BOOLEAN },
  date: { type: Sequelize.DATE },
});

const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

BudgetModel.belongsTo(UserModel);

// messages are sent to groups
TransactionModel.belongsTo(UserModel);

const Transaction = db.models.transaction;
const Budget = db.models.budget;
const User = db.models.user;

export { Transaction, Budget, User };