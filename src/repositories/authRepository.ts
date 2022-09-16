import prisma from '../databases/postgres';
import { User } from '@prisma/client';
import { IUserData } from '../types/userTypes';

export async function getUserByEmail(email: string): Promise<User | null> {
  const user: User | null = await prisma.user.findFirst({ where: { email } });

  return user;
}

export async function insert(user: IUserData): Promise<User>{
  return await prisma.user.create({ data: user });
}