import * as authRepository from '../repositories/authRepository';
import { IUserData } from '../types/userTypes';
import { User } from '@prisma/client';
import { conflictError } from '../utils/errorUtils';

async function isEmailRegistered(email: string) {
  const user: User | null = await authRepository.getUserByEmail(email);

  if(user) {
    throw conflictError('email já cadastrado');
  }
}

export async function createUser(user: IUserData) {
  await isEmailRegistered(user.email);

  const newUser: User = await authRepository.insert(user);

  return newUser;
}