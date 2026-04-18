import {
  type StorageAdapter,
  type StorageEntry,
  type StorageWriteOptions,
  type StorageWriteResult,
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

    async list(path) {
      const fullPath = resolvePath(path);
      const res = await client.rest.repos.getContent({
        owner: options.owner,
        repo: options.repo,
        path: fullPath,
        ref: branch,
      });

      const data = res.data;
      if (!Array.isArray(data)) {
        // A single file was returned — wrap as a list of one
        if (data.type === 'file') {
          return [
            {
              path: data.path,
              content: '',
              isBinary: false,
              revision: data.sha,
            },
          ];
        }
        return [];
      }

      return data
        .filter((item) => item.type === 'file')
        .map((item) => ({
          path: item.path,
          content: '',
          isBinary: false,
          revision: item.sha,
        }));
    },

    async write(path, content, writeOptions?: StorageWriteOptions) {
      const fullPath = resolvePath(path);

      // Fetch existing file to obtain its sha (required for update).
      let existingSha: string | undefined;
      try {
        const existing = await client.rest.repos.getContent({
          owner: options.owner,
          repo: options.repo,
          path: fullPath,
          ref: branch,
        });
        if (!Array.isArray(existing.data) && existing.data.type === 'file') {
          existingSha = existing.data.sha;
        }
      } catch (err) {
        if ((err as { status?: number }).status !== 404) throw err;
      }

      const author = writeOptions?.author ?? options.author;

      const res = await client.rest.repos.createOrUpdateFileContents({
        owner: options.owner,
        repo: options.repo,
        path: fullPath,
        branch,
        message: writeOptions?.message ?? `chore(content): update ${path}`,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        ...(existingSha ? { sha: existingSha } : {}),
        ...(author ? { committer: author, author } : {}),
      });

      const resultSha =
        res.data.commit?.sha ?? res.data.content?.sha ?? existingSha ?? '';

      const result: StorageWriteResult = { path, revision: resultSha };
      return result;
    },

    async delete(path, deleteOptions?: StorageDeleteOptions) {
      const fullPath = resolvePath(path);

      let sha: string | undefined;
      try {
        const existing = await client.rest.repos.getContent({
          owner: options.owner,
          repo: options.repo,
          path: fullPath,
          ref: branch,
        });
        if (!Array.isArray(existing.data) && existing.data.type === 'file') {
          sha = existing.data.sha;
        }
      } catch (err) {
        if ((err as { status?: number }).status === 404) return;
        throw err;
      }

      if (!sha) return;

      const author = deleteOptions?.author ?? options.author;

      await client.rest.repos.deleteFile({
        owner: options.owner,
        repo: options.repo,
        path: fullPath,
        branch,
        message: deleteOptions?.message ?? `chore(content): delete ${path}`,
        sha,
        ...(author ? { committer: author, author } : {}),
      });
    },

    async branch() {
      const res = await client.rest.repos.getBranch({
        owner: options.owner,
        repo: options.repo,
        branch,
      });
      return { name: res.data.name, head: res.data.commit.sha };
    },
  };
}
