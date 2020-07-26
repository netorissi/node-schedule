import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUser {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkExists = await this.usersRepository.findByEmail(email);

    if (checkExists) throw new AppError('Email already used.');

    const hashPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return user;
  }
}

export default CreateUser;
