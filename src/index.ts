import {Stream} from './stream';
import {Client} from './client';
import * as user from './user';
import * as db from './db';

// export * from './user';
// export * from './db';

export default {
  Client,
  Stream,
  ...user,
  ...db,
};

module.exports = {
  Client,
  Stream,
  ...user,
  ...db,
};
