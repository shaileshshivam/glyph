import {
  type StorageAdapter,
  type StorageEntry,
  type StorageWriteOptions,
  type StorageDeleteOptions,
  StorageEntryNotFoundError,
} from '@glyph/core';
import { createGitHubClient, type GitHubClientOptions } from './client';

export interface GithubStorageOptions extends GitHubClientOptions {
  owner: string;
  repo: string;
  branch?: string;
  /** Prefix prepended to every path. */
  contentRoot?: string;
  /** Default commit author. */
  author?: { name: string; email: string };
}

const BINARY_DETECT_SAMPLE = 512;

function isLikelyBinary(bytes: Uint8Array): boolean {
  const sample = bytes.slice(0, BINARY_DETECT_SAMPLE);
  for (const byte of sample) {
    if (byte === 0) return true;
    if (byte < 7 || (byte > 13 && byte < 32 && byte !== 27)) return true;
  }
  return false;
}

/**
 * Build a StorageAdapter backed by the GitHub REST API.
 */
export function createGithubStorageAdapter(options: GithubStorageOptions): StorageAdapter {
  const branch = options.branch ?? 'main';
  const contentRoot = options.contentRoot?.replace(/\/+$/, '') ?? '';
  const clientOptions: GitHubClientOptions = { token: options.token };
  if (options.baseUrl !== undefined) clientOptions.baseUrl = options.baseUrl;
  if (options.userAgent !== undefined) clientOptions.userAgent = options.userAgent;
  const client = createGitHubClient(clientOptions);

  const resolvePath = (path: string) =>
    contentRoot ? `${contentRoot}/${path.replace(/^\/+/, '')}` : path.replace(/^\/+/, '');

  return {
    async read(path) {
      const fullPath = resolvePath(path);
      try {
        const res = await client.rest.repos.getContent({
          owner: options.owner,
          repo: options.repo,
          path: fullPath,
          ref: branch,
        });

        const data = res.data;
        if (Array.isArray(data) || data.type !== 'file') {
          throw new StorageEntryNotFoundError(path);
        }

        const bytes = Buffer.from(data.content, 'base64');
        const isBinary = isLikelyBinary(new Uint8Array(bytes));

        const entry: StorageEntry = {
          path,
          content: isBinary ? data.content : bytes.toString('utf-8'),
          isBinary,
          revision: data.sha,
        };
        return entry;
      } catch (err) {
        if ((err as { status?: number }).status === 404) {
          throw new StorageEntryNotFoundError(path);
        }
        throw err;
      }
    },

    async list(_path) {
      throw new Error('not implemented yet');
    },

    async write(_path, _content, _options?: StorageWriteOptions) {
      throw new Error('not implemented yet');
    },

    async delete(_path, _options?: StorageDeleteOptions) {
      throw new Error('not implemented yet');
    },

    async branch() {
      throw new Error('not implemented yet');
    },
  };
}
