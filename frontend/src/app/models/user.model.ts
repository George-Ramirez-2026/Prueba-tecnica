export interface User {
  id: number;
  username: string;
  email: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  estado: boolean;
}

export interface LoginResponse {
  token: string;
  username: string;
  expiresInMs: number;
}
