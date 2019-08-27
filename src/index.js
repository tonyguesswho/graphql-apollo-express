import cors from 'cors';
import jwt from 'jsonwebtoken'
import express from 'express';
import DataLoader from 'dataloader';
import http from 'http';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import db from './models';
import { schemaDirectives } from  './directives'
import loaders from './loaders';

const app = express();

app.use(cors());



const getUser = async token => {
    // const token = req.headers['x-token'];
    if(token){
      try {
        return await jwt.verify(token, process.env.SECRET);
      }catch (e) {
        throw new AuthenticationError(
          'Your session expired. Sign in again.',
        );
      }
    }
  };

// const userLoader = new DataLoader(keys => loaders.user.batchUsers(keys, db));

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  schemaDirectives,
  context: async ({ req, connection }) => {
    if(connection) {
    const token = connection.context['x-token'];
    const me = await getUser(token);
      return {
        db,
        me,
        secret: process.env.SECRET,
      };
    }
    if(req) {
    const token = req.headers['x-token'];
    const me = await getUser(token);
      return {
        db,
        me,
        secret: process.env.SECRET,
        loaders: {
            user: new DataLoader(keys => loaders.user.batchUsers(keys, db)),
        },
      };
    }
  },
});



server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


httpServer.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

module.exports = { server };