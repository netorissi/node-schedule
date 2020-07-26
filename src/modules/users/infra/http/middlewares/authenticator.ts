import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/authenticator';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function Authenticator(
  request: Request,
  response: Response, // eslint-disable-line
  next: NextFunction, // eslint-disable-line
): void {
  const { authorization } = request.headers;

  if (!authorization) throw new AppError('Authetication failed.');

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };
  } catch {
    throw new AppError('Invalid authentication', 401);
  }
}
