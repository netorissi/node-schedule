import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/create';
import UpdateAvatarService from '@modules/users/services/updateAvatar';
import authenticator from '@modules/users/infra/http/middlewares/authenticator';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  authenticator,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateAvatar = new UpdateAvatarService(usersRepository);
    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatar_name: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  },
);

export default usersRouter;
