import Chance from 'chance';
import {User} from './api';

const chance = new Chance();
const user = User();

const TEST_EMAIL = 'node@m3o.com';

describe('User integration tests:', () => {
  describe('signUp:', () => {
    it('should sign up a user', async () => {
      const email = chance.email();
      const response = await user.signUp({
        email,
        password: 'password',
        username: email,
      });

      expect(response).toEqual({
        account: {
          id: expect.any(String),
          email,
          username: email,
          created: expect.any(String),
          updated: expect.any(String),
        },
      });
    });
  });

  describe('login:', () => {
    it('should login the user and return the session details', async () => {
      const response = await user.login({
        email: TEST_EMAIL,
        password: 'password',
      });

      expect(response).toEqual({
        session: {
          id: expect.any(String),
          userId: expect.any(String),
          created: expect.any(String),
          expires: expect.any(String),
        },
      });
    });
  });

  describe('logout:', () => {
    it('should logout the user', async () => {
      const loginResponse = await user.login({
        email: TEST_EMAIL,
        password: 'password',
      });

      const logoutResponse = await user.logout({
        sessionId: loginResponse.session.id,
      });

      expect(logoutResponse).toEqual({});
    });
  });

  describe('delete', () => {
    it('should successfully delete the user', async () => {
      const email = chance.email();

      const signUpResponse = await user.signUp({
        email,
        password: 'password',
        username: email,
      });

      const deleteResponse = await user.delete({
        id: signUpResponse.account.id,
      });

      expect(deleteResponse).toEqual({});
    });
  });
});
