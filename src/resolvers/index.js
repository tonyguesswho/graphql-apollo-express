import userResolvers from './user';
import messageResolvers from './message';
import { GraphQLDateTime } from 'graphql-iso-date';

const customScalarResolver = {
    Date: GraphQLDateTime,
};


export default [userResolvers, messageResolvers, customScalarResolver];