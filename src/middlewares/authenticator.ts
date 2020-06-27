import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/authenticator';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function Authenticator(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization } = request.headers;

  if (!authorization) throw new Error('Authetication failed.');

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };
  } catch {
    throw new Error('Invalid authentication');
  }
}
