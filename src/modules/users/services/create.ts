import { inject, injectable } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkExists = await this.usersRepository.findByEmail(email);

    if (checkExists) throw new AppError('Email already used.');

    const hashPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return user;
  }
}

export default CreateUser;
