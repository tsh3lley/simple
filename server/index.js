import express from 'express';
import jwt from 'express-jwt';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './src/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { db } from './src/connectors';
import { JWT_SECRET } from './config';
import { graphql } from 'graphql';
import { User } from './src/connectors'

db.sync();

const PORT = 4000;
const server = express();

server.use('*', bodyParser.json(), cors({ origin: 'http://localhost:3000' }));

try{
  server.use(
    '/graphql',
    jwt({
        secret: JWT_SECRET,
        credentialsRequired: false
    }),
    graphqlExpress(req => ({ 
      schema,
      context: {
        user: req.user
      },
    }))
  );
} catch(err){
  console.log(err);
}

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// accept webhook via rest
server.post('/webhook', async (req, res) => {
  const webhookMutation = `
    mutation {
      refreshTransactionsWebhook(
        itemId: "${req.body.item_id}"
        newTransactions: ${req.body.new_transactions}
        webhookCode: "${req.body.webhook_code}"
      )
    }
  `
  res.send(null);
  const transactionsResult = await graphql(schema, webhookMutation);
  console.log('webhook hit')
  //console.log(transactionsResult);
});


server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
});
