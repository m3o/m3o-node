import {makeService} from '../helpers';
import {DBApi, DBMethods} from './types';

export function DB<RecordType>(): DBApi<RecordType> {
  const dbService = makeService<DBMethods>('user');

  return {
    create: payload => dbService.request('Create', payload),
    delete: payload => dbService.request('Delete', payload),
    read: payload => dbService.request('Read', payload),
    update: payload => dbService.request('Update', payload),
    truncate: payload => dbService.request('Truncate', payload),
  };
}
