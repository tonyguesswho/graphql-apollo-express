import { gql } from 'apollo-server-express';
import userSchema from './user';
import messageSchema from './message';
const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
  directive @auth on FIELD_DEFINITION
`;
export default [linkSchema, userSchema, messageSchema];