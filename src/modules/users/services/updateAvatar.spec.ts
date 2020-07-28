import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeDiskStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeDiskStorageProvider';

import UpdateAvatarService from './updateAvatar';

describe('UpdateUserAvatar', () => {
  it('should be able to update a avatar user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const updateAvatar = new UpdateAvatarService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatar_name: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update a avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const updateAvatar = new UpdateAvatarService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );

    expect(
      updateAvatar.execute({
        user_id: 'non-existing',
        avatar_name: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete a avatar user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const updateAvatar = new UpdateAvatarService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'j0hnd03',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatar_name: 'avatar.png',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatar_name: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
