import { inject, injectable } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
// import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
}

@injectable()
class ForgotPasswordsendMail {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Usuário inválido', 400);

    this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(email, 'Recuperação de senha');
  }
}

export default ForgotPasswordsendMail;
