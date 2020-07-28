import { container } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/storageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
