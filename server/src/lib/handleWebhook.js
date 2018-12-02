import { schema } from '../schema';
import { graphql } from 'graphql';
import { User, PlaidItem} from '../connectors';
import { JWT_SECRET, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, WEBHOOK_URL } from '../../config';


const handleWebhook = async (req) => {
  //TODO: fix error that happens every time this gets hit for the first time
	const { item_id, num_transactions, webhook_code } = req.body;
  console.log(item_id)
  //TODO: fix this, if the Item id cant be found/linked to a user, return an error
  const item = await PlaidItem.findOne({
    where: {itemId: item_id}, 
    include: User,
  });
  const user = item.user;
  console.log(user.id)
  const webhookMutation = `
    mutation {
      syncTransactions(
        userId: ${ user.id }
      )
    }
  `
  const transactionsResult = await graphql(schema, webhookMutation);
  console.log(transactionsResult )
  console.log('handled')
  return true;
}

export default handleWebhook;