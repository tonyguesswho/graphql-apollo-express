import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin, isAuthenticated } from './authorization';
import { combineResolvers } from 'graphql-resolvers';


const createToken = async (user, secret, expiresIn) => {
    const { id, email, username, role } = user;
    return await jwt.sign({ id, email, username, role }, secret, {
        expiresIn,
    });
};

export default {
  Query: {
    users: async (parent, args, { db }) => {
        return await db.User.findAll();
    },
    user: async (parent, { id }, { db }) => {
        return await db.User.findByPk(id);
    },
    me:combineResolvers(
        isAuthenticated,
        async (parent, args, { db, me }) => {
            return await db.User.findByPk(me.id);
        }
    )
  },
  Mutation: {
    signUp: async (
        parent,
        { username, email, password },
        { db, secret },
      ) => {
        const user = await db.User.create({
          username,
          email,
          password,
        });
        return { token: createToken(user, secret, '30m') };
      },
    signIn: async (
        parent,
        { login, password },
        { db, secret },
      ) => {
        const user = await db.User.findByLogin(login);
        if (!user) {
          throw new UserInputError(
            'No user found with this login credentials.',
          );
        }
        const isValid = await user.validatePassword(password);
        if (!isValid) {
          throw new AuthenticationError('Invalid password.');
        }
        return { token: createToken(user, secret, '30m') };
    },
    deleteUser: combineResolvers(
        isAdmin,
        async (parent, { id }, { db }) => {
            return await models.User.destroy({
              where: { id },
            });
        },
    )
  },
  User: {
    messages: async (user, args, { db }) => {
        return await db.Message.findAll({
            where: {
              userId: user.id,
            },
        });
    },
  },
};