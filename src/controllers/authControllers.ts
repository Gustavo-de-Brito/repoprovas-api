import { User } from '@prisma/client';
import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { IUserData } from '../types/userTypes';

export async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const newUser: IUserData = { email: email, password: password };

  await authService.createUser(newUser);

  res.sendStatus(201);
}

export async function loginUser(req: Request, res: Response) {
  const user: IUserData = req.body;

  const token: string = await authService.loginUser(user);

  res.status(200).send({ token });
}