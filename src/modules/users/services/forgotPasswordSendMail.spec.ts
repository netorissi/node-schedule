import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';
import ForgotPasswordService from './forgotPasswordSendMail';

describe('ForgotPassword', () => {
  it('should be able to remember password with your email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const forgotPassword = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    await forgotPassword.execute({
      email: 'john@doe.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to remember password without email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const forgotPassword = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await expect(
      forgotPassword.execute({
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
