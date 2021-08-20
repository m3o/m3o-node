export type DBMethods = 'Create' | 'Delete' | 'Read' | 'Truncate' | 'Update';

export type DBCreatePayload<R, TN> = {
  record: R;
  table: TN;
};

export type DBCreateResponse = {
  id: string;
};

export type DBDeletePayload<TN> = {
  id: string;
  table: TN;
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

export type DBCreate<R, TN> = (
  payload: DBCreatePayload<R, TN>,
) => Promise<DBCreateResponse>;

export type DBTruncatePayload<TN> = {
  table?: TN;
};

export type DBTruncateTableResponse = {
  table: string;
};

export type DBUpdatePayload<R, TN> = {
  id: string;
  record: R;
  table?: TN;
};

export type DBDelete<TN> = (payload: DBDeletePayload<TN>) => Promise<void>;

export type DBRead<R> = (payload: DBReadPayload) => Promise<DBReadResponse<R>>;

export type DBTruncate<TN> = (
  payload: DBTruncatePayload<TN>,
) => Promise<DBTruncateTableResponse>;

export type DBUpdate<R, TN> = (
  payload: DBUpdatePayload<R, TN>,
) => Promise<void>;

export type DBApi<R, TN> = {
  create: DBCreate<R, TN>;
  delete: DBDelete<TN>;
  read: DBRead<R>;
  truncate: DBTruncate<TN>;
  update: DBUpdate<R, TN>;
};
