import express from 'express';
import jwt from 'express-jwt';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './src/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { db } from './src/connectors';
import { JWT_SECRET } from './config'

db.sync();

const PORT = 4000;
const server = express();

server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use(
  '/graphql',
  jwt({
      secret: JWT_SECRET,
      credentialsRequired: false
  }),
  bodyParser.json(),
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

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
});
