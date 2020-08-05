import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/mailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';
import ForgotPasswordService from './forgotPasswordSendMail';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let forgotPassword: ForgotPasswordService;
let fakeMailProvider: FakeMailProvider;

describe('ForgotPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    forgotPassword = new ForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to remember password with your email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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
    await expect(
      forgotPassword.execute({
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a token forgot password', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    await forgotPassword.execute({
      email: 'john@doe.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
