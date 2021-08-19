export type DBMethods = 'Create' | 'Delete' | 'Read' | 'Truncate' | 'Update';

export type DBCreatePayload<R> = {
  record: R;
  table: string;
};

export type DBCreateResponse = {
  id: string;
};

export type DBDeletePayload = {
  id: string;
  table: string;
};

export type DBReadPayload = {
  id?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
  query?: string;
  table?: string;
};

export type DBReadResponse<R> = {
  records?: R[];
};

export type DBCreate<R> = (
  payload: DBCreatePayload<R>,
) => Promise<DBCreateResponse>;

export type DBTruncatePayload = {
  table?: string;
};

export type DBTruncateTableResponse = {
  table: string;
};

export type DBUpdatePayload<R> = {
  id: string;
  record: R;
  table?: string;
};

export type DBDelete = (payload: DBDeletePayload) => Promise<void>;

export type DBRead<R> = (payload: DBReadPayload) => Promise<DBReadResponse<R>>;

export type DBTruncate = (
  payload: DBTruncatePayload,
) => Promise<DBTruncateTableResponse>;

export type DBUpdate<R> = (payload: DBUpdatePayload<R>) => Promise<void>;

export type DBApi<R> = {
  create: DBCreate<R>;
  delete: DBDelete;
  read: DBRead<R>;
  truncate: DBTruncate;
  update: DBUpdate<R>;
};
