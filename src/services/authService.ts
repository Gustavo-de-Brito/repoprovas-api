import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository';
import { IUserData } from '../types/userTypes';
import { User } from '@prisma/client';
import { conflictError, unauthorizedError } from '../utils/errorUtils';

async function isEmailConflicting(email: string) {
  const user: User | null = await authRepository.getUserByEmail(email);

  if(user) {
    throw conflictError('email já cadastrado');
  }
}

export async function createUser(user: IUserData) {
  await isEmailConflicting(user.email);
  const SALT = 10;

  const encryptedPassword: string = bcrypt.hashSync(user.password, SALT);
  const newUser: IUserData = {...user, password: encryptedPassword };

  const createdUser: User = await authRepository.insert(newUser);

  return createdUser;
}

async function isEmailRegistered(email: string) {
  const user: User | null = await authRepository.getUserByEmail(email);

  if(!user) throw unauthorizedError('Dados de login inválidos');

  return user;
}

export async function loginUser(user:IUserData): Promise<string> {
  const userData: User = await isEmailRegistered(user.email);

  const isRightPassword: boolean = bcrypt.compareSync(
    user.password,
    userData.password
  );

  if(!isRightPassword) throw unauthorizedError('Dados de login inválidos');

  const JWT_PRIVATE_KEY: string = process.env.JWT_PRIVATE_KEY ?? '';
  const EXPIRATION_TOKEN_TIME = 60 * 60 * 2; // 2 hours

  const token: string = jwt.sign(
    { userId: userData.id },
    JWT_PRIVATE_KEY,
    { expiresIn: EXPIRATION_TOKEN_TIME }
  );

  return token;
}