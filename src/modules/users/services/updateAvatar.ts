import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
  user_id: string;
  avatar_name: string;
}

export default class UpdateAvatar {
  public async execute({ user_id, avatar_name }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatar = path.join(uploadConfig.directory, user.avatar);
      const avatarExists = await fs.promises.stat(userAvatar);

      if (avatarExists) {
        await fs.promises.unlink(userAvatar);
      }
    }

    user.avatar = avatar_name;

    await usersRepository.save(user);
    return user;
  }
}
