import type { AddressDto } from "./AddressType";

export type GenderType = 'MALE' | 'FEMALE' | 'OTHER'; 
export type UserRoleType = 'USER' | 'MY_SHOP' | 'ADMIN';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  gender: GenderType;
  dob: string; 
  role: string;
  createdAt: string; 
  updatedAt: string;

  address?: AddressDto;
  cartCount?: number;
  hasShop?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface ProfileRequest {
  fullName: string;
  phoneNumber?: string;
  gender: GenderType;
  dob: string;
  avatarUrl?: string;
}


export interface forgotPwRequest  {
  email: string;
  password: string;
  otp: string;
}