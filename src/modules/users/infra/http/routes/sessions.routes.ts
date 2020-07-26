import { Router } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateSessionService from '@modules/users/services/createSession';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const usersRepository = new UsersRepository();

  const createSession = new CreateSessionService(usersRepository);

  const { user, token } = await createSession.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
