import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';

interface Request {
  user_id: string;
  avatar_name: string;
}

@injectable()
export default class UpdateAvatar {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageRepository: IStorageProvider,
  ) {}

  public async execute({ user_id, avatar_name }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageRepository.deleteFile(user.avatar);
    }

    const filename = await this.storageRepository.saveFile(avatar_name);

    user.avatar = filename;

    await this.usersRepository.save(user);
    return user;
  }
}
