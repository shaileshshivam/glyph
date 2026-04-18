/**
 * StorageAdapter — the interface every storage backend implements.
 *
 * An adapter provides file-like read/write/list/delete operations scoped to
 * a single "workspace" (e.g. a branch of a git repo, a local folder, a
 * database table). Implementations handle all backend-specific auth,
 * paging, and commit messaging.
 */
export interface StorageAdapter {
  /** Read a single entry by path. Throws StorageEntryNotFoundError if missing. */
  read(path: string): Promise<StorageEntry>;

  /**
   * List entries under a prefix path. Non-recursive by default; adapters
   * may document their own recursion semantics.
   */
  list(path: string): Promise<StorageEntry[]>;

  /**
   * Create or update an entry. Returns the committed entry with its new
   * revision identifier (e.g. commit SHA).
   */
  write(path: string, content: string, options?: StorageWriteOptions): Promise<StorageWriteResult>;

  /** Delete an entry. No-op if it doesn't exist. */
  delete(path: string, options?: StorageDeleteOptions): Promise<void>;

  /** Return metadata about the current branch / HEAD. */
  branch(): Promise<{ name: string; head: string }>;
}

export interface StorageEntry {
  /** Path relative to the workspace root. */
  path: string;
  /** File content. Binary content is base64-encoded. */
  content: string;
  /** True if the content is base64-encoded binary. */
  isBinary: boolean;
  /** Revision identifier (e.g. commit SHA) of the version read. */
  revision: string;
}

export interface StorageWriteOptions {
  /** Human-readable commit message. */
  message?: string;
  /** Author info for commit attribution. */
  author?: { name: string; email: string };
}

export interface StorageDeleteOptions {
  message?: string;
  author?: { name: string; email: string };
}

export interface StorageWriteResult {
  path: string;
  revision: string;
}

/** Thrown when a read/list operation targets a missing path. */
export class StorageEntryNotFoundError extends Error {
  readonly code = 'STORAGE_ENTRY_NOT_FOUND';

  constructor(public readonly path: string) {
    super(`Storage entry not found: ${path}`);
    this.name = 'StorageEntryNotFoundError';
  }
}
