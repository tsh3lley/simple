import { schema } from '../schema';
import { graphql } from 'graphql';

const handleWebhook = async (req) => {
  const webhookMutation = `
    mutation {
      refreshTransactionsWebhook(
        itemId: "${req.body.item_id}"
        newTransactions: ${req.body.new_transactions}
        webhookCode: "${req.body.webhook_code}"
      )
    }
  `
  const transactionsResult = await graphql(schema, webhookMutation);
  return true;
}

export default handleWebhook;