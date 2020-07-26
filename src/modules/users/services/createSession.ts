import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/authenticator';
import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSession {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new AppError('Invalid email or password.', 401);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError('Invalid email or password.', 401);

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default CreateSession;
