export const version = '0.0.0';

export type {
  StorageAdapter,
  StorageEntry,
  StorageWriteOptions,
  StorageWriteResult,
  StorageDeleteOptions,
} from './adapters/storage';
export { StorageEntryNotFoundError } from './adapters/storage';
