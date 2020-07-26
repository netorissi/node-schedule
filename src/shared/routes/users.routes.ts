import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../../modules/users/services/create';
import UpdateAvatarService from '../../modules/users/services/updateAvatar';
import authenticator from '../middlewares/authenticator';
import uploadConfig from '../../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

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
    const updateAvatar = new UpdateAvatarService();
    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatar_name: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  },
);

export default usersRouter;