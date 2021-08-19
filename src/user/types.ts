export type UserMethods =
  | 'Create'
  | 'Delete'
  | 'Login'
  | 'Logout'
  | 'Read'
  | 'ReadSession'
  | 'SendVerificationEmail'
  | 'Update'
  | 'UpdatePassword'
  | 'VerifyEmail';

type UserProfile = Record<string, string>;

type UpdatePasswordPayload = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
  userId: string;
};

type UpdatePayload = {
  email: string;
  id: string;
  profile: UserProfile;
  username: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  id?: string;
  profile?: Record<string, string>;
  username?: string;
};

export type UserAccount = {
  created: number;
  email: string;
  id: string;
  profile?: Record<string, string>;
  updated: number;
  username: string;
  verificationDate?: string;
  verified?: boolean;
};

export type UserResponse = {
  account: UserAccount;
};

export type SendVerificationPayload = {
  email: string;
  failureRedirectUrl: string;
  fromName: string;
  redirectUrl: string;
  subject: string;
  textContent: string;
};

export type LoginUserPayload = {
  email?: string;
  username?: string;
  password: string;
};

export type LoginUserResponse = {
  session: {
    id: string;
    created: string;
    expires: string;
    userId: string;
  };
};

export type LogoutPayload = {
  sessionId: string;
};

export type DeletePayload = {
  id: string;
};

type Delete = (payload: DeletePayload) => Promise<void>;
type SignUp = (payload: CreateUserPayload) => Promise<UserResponse>;
type Login = (payload: CreateUserPayload) => Promise<LoginUserResponse>;
type GetById = (id: string) => Promise<UserResponse>;
type Logout = (payload: LogoutPayload) => Promise<void>;
type ReadSession = (sessionId: string) => Promise<UserSession>;
type SendVerificationEmail = (
  payload: SendVerificationPayload,
) => Promise<void>;
type Update = (payload: UpdatePayload) => Promise<void>;
type UpdatePassword = (payload: UpdatePasswordPayload) => Promise<void>;
type VerifyEmail = (token: string) => Promise<void>;

export type UserApi = {
  delete: Delete;
  getById: GetById;
  login: Login;
  logout: Logout;
  readSession: ReadSession;
  sendVerificationEmail: SendVerificationEmail;
  signUp: SignUp;
  update: Update;
  updatePassword: UpdatePassword;
  verifyEmail: VerifyEmail;
};

export type UserSession = UserResponse['account'] | null;
