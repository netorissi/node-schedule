import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../../../shared/errors/AppError';
import User from '../entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUser {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkExists = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (checkExists) throw new AppError('Email already used.');

    const hashPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUser;