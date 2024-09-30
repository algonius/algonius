
import { Storage } from '@plasmohq/storage'

export type StorageType = 'local' | 'sync'

export interface AsyncStorage<Value> {
  getItem: (key: string, initialValue: Value) => PromiseLike<Value>;
  setItem: (key: string, newValue: Value) => PromiseLike<void>;
  removeItem: (key: string) => PromiseLike<void>;
  subscribe?: (callback: (value: Value) => void) => () => void;
}

export class PlasmoStorage<Value> implements AsyncStorage<Value> {
  private storage: Storage;

  constructor(storageType: StorageType) {
    this.storage = new Storage({ area: storageType });
  }

  async getItem(key: string, initialValue: Value): Promise<Value> {
    try {
      const value = await this.storage.get<Value>(key);
      return value === undefined ? initialValue : value;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return initialValue;
    }
  }

  async setItem(key: string, newValue: Value): Promise<void> {
    try {
      await this.storage.set(key, newValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  // subscribe 方法暂不实现，因为 @plasmohq/storage 没有直接提供这个功能
  // 如果将来需要，可以考虑使用自定义事件系统来实现
}
