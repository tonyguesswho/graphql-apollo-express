import { combineResolvers } from 'graphql-resolvers';
// import { ForbiddenError } from 'apollo-server';
import { isAuthenticated , isMessageOwner} from './authorization';
import pubsub, { EVENTS } from '../subscription';

export default {
  Query: {
    messages: async (parent, { offset = 0, limit = 100 }, { db }) => {
        return await db.Message.findAll({
            offset,
            limit,
          });
    },
    message: async (parent, { id }, { db }) => {
        return await db.Message.findByPk(id);
    },
  },
  Mutation: {
    createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { db, me }) => {
          const message = await db.Message.create({
            text,
            userId: me.id,
          });
          pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message },
          });
          return message;
        },
    ),
    deleteMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner,
        async (parent, { id }, { db }) => {
          return await db.Message.destroy({ where: { id } });
        },
      ),
  },
  Message: {
    user: async (message, args, { loaders }) => {
        return await loaders.user.load(message.userId);
    },
    // text: (message, args, { me })=>{
    //     if(!me){
    //         throw new ForbiddenError('Login to access the text field');
    //     }
    //     return message.text
    // }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};