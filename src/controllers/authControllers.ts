import { User } from '@prisma/client';
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { IUserData } from '../types/userTypes';

export async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const newUser: IUserData = { email: email, password: password };

  const createdUser: User = await authService.createUser(newUser);

  res.status(201).send(createdUser);
}