import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { combineResolvers } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');


export const isMessageOwner = async (
    parent,
    { id },
    { db, me },
  ) => {
    const message = await db.Message.findByPk(id, { raw: true });
    if (message.userId !== me.id) {
      throw new ForbiddenError('Not authenticated as owner.');
    }
    return skip;
};

export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) =>
      role === 'ADMIN'
        ? skip
        : new ForbiddenError('Not authorized as admin.'),
  );

export const directiveResolvers = {
    isAuthenticated: (next, source, args, { me }) => {
      if(me) return next()
      throw new Error(`Must be logged in to view this field`)
    },
  }