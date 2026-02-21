export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  message: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}
