import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';
import { unprocessableError, unauthorizedError } from '../utils/errorUtils';
import * as authService from '../services/authService';

dotenv.config();

async function tokenValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization: string | undefined = req.headers.authorization;

  if(!authorization?.includes('Bearer')) {
    throw unprocessableError('o formato do token é inválido');
  }

  const token:string | undefined = authorization?.replace('Bearer ', '');

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? '';
    const { userId } = jwt.verify(token, JWT_PRIVATE_KEY) as { userId: number };

    const userData: User | null = await authService.getUSerById(userId);

    if(!userData) throw unauthorizedError('o token é inválido');

    res.locals.userData = userData;

    next();
  } catch {
    throw unauthorizedError('o token é inválido');
  }
}

export default tokenValidation;