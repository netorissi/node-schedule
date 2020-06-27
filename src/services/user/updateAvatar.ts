import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../../config/upload';
import User from '../../models/User';

interface Request {
  user_id: string;
  avatar_name: string;
}

export default class UpdateAvatar {
  public async execute({ user_id, avatar_name }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = userRepository.findOne(user_id);

    if (!user) {
      throw new Error('[ERROR] Change avatar - User not found.');
    }

    if (user.avatar) {
      const userAvatar = path.join(uploadConfig.directory, user.avatar);
      const avatarExists = await fs.promises.stat(userAvatar);

      if (avatarExists) {
        await fs.promises.unlink(userAvatar);
      }

      user.avatar = avatar_name;

      await userRepository.save(user);

      return user;
    }
  }
}
