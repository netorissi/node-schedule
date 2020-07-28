import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';

interface IDiskStorage {
  file: string;
}

class FakeDiskStorageProvider implements IStorageProvider {
  private storage: IDiskStorage[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push({ file });

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(store => store.file === file);

    this.storage.splice(findIndex, 1);
  }
}

export default FakeDiskStorageProvider;
