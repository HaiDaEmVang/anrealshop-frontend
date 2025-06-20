import type { UserDto } from "./UserType";

export type  OTP_TYPE = 'REGISTER' | 'RESET_PASSWORD';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserDto;
}

export interface OtpRequest {
  code: string;
  email: string;
}

export interface ResetPwRequest {
  email: string;
  password: string;
  otp: string;
}