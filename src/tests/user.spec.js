import { expect } from 'chai';
import * as userApi from './api';
// import  { server } from '../../src/index'
describe('users', () => {
  describe('signUp(username: String!, email: String!, password: String!): User', () => {
    it('returns token for a new user', async () => {
      const result = await userApi.signUp({username: "teslllu", email: "tloot@gmail.com", password: "testpassword"});
      expect(result.data.data.signUp).to.haveOwnProperty('token');
    });
  });
});