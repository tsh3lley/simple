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

db.sync();

const PORT = 4000;
const server = express();

server.use('*', bodyParser.json(), cors({ origin: 'http://localhost:3000' }));

server.use(
  '/graphql',
  jwt({
      secret: JWT_SECRET,
      credentialsRequired: false
  }),
  graphqlExpress(req => ({ 
    schema,
    context: {
      user: req.user || {}
    }
  }))
);

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

// accept webhook via rest cuz plaid isnt F U T U R E
server.post('/webhook', async (req, res) => {
  //webhook query
  const webhookMutation = `
    mutation {
      refreshTransactionsWebhook(
        itemId: "${req.body.itemId}"
        newTransactions: ${req.body.newTransactions}
      )
    }
  `
  res.send(null);
  const transactionsResult = await graphql(schema, webhookMutation);
  console.log(transactionsResult);
});


server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
});
