import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';

interface IMail {
  to: string;
  body: string;
}

class FakeMailProvider implements IMailProvider {
  private mails: IMail[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.mails.push({ to, body });
  }
}

export default FakeMailProvider;
