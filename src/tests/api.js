import axios from 'axios';
const API_URL = 'http://localhost:8000/graphql';
export const signUp = async variables =>
  await axios.post(API_URL, {
    query: `
      mutation ($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
    variables,
  });