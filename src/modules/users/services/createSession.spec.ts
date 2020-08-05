import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';
import CreateSessionService from './createSession';
import CreateUserService from './create';

describe('CreateSession', () => {
  it('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    const response = await createSession.execute({
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to create a new session with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      createSession.execute({
        email: 'john@doe.com',
        password: 'j0hnd03',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    await expect(
      createSession.execute({
        email: 'john@doe.com',
        password: 'j0hnd03-wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
