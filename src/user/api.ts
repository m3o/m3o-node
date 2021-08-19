import {makeService} from '../helpers';
import {UserMethods, UserApi} from './types';

export function User(): UserApi {
  const userService = makeService<UserMethods>('user');

  return {
    delete: payload => userService.request('Delete', payload),
    getById: id => userService.request('Read', {id}),
    login: payload => userService.request('Login', payload),
    logout: payload => userService.request('Logout', payload),
    readSession: (sessionId: string) =>
      userService.request('ReadSession', {sessionId}),
    sendVerificationEmail: payload =>
      userService.request('SendVerificationEmail', payload),
    signUp: payload => userService.request('Create', payload),
    update: payload => userService.request('Update', payload),
    updatePassword: payload => userService.request('UpdatePassword', payload),
    verifyEmail: token => userService.request('VerifyEmail', {token}),
  };
}
