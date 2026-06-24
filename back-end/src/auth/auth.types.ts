export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtAccessPayload {
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  type: 'access';
}

export interface JwtRefreshPayload {
  userId: string;
  jti: string;
  type: 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface InternalSession {
  accessToken: string;
  refreshToken: string;
  user: { id: string; username: string; email: string; role: 'admin' | 'user' };
}
