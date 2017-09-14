const calcTotalSpent = (transactions) => {
  const transactionsSum = transactions.reduce((sum, transaction) => {
    sum += transaction.amount;
    return sum;
  }, 0);

  return transactionsSum;
}

export default calcTotalSpent;
