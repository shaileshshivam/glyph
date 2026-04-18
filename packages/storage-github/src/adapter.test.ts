import { describe, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { StorageEntryNotFoundError } from '@glyph/core';
import { createGithubStorageAdapter } from './adapter';
import { API, server, handlers } from './__tests__/mocks';

function encodeContentPath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('%2F');
}

function adapter() {
  return createGithubStorageAdapter({
    owner: 'acme',
    repo: 'site',
    branch: 'main',
    token: 'test-token',
  });
}

describe('GithubStorageAdapter.read', () => {
  test('reads a text file and decodes base64 content', async () => {
    server.use(
      handlers.getContent('acme', 'site', 'src/content/posts/hello.mdx', {
        type: 'file',
        encoding: 'base64',
        content: Buffer.from('# Hello world\n').toString('base64'),
        sha: 'abc123',
        path: 'src/content/posts/hello.mdx',
      }),
    );

    const entry = await adapter().read('src/content/posts/hello.mdx');

    expect(entry.path).toBe('src/content/posts/hello.mdx');
    expect(entry.content).toBe('# Hello world\n');
    expect(entry.isBinary).toBe(false);
    expect(entry.revision).toBe('abc123');
  });

  test('throws StorageEntryNotFoundError on 404', async () => {
    server.use(handlers.getContentMissing('acme', 'site', 'missing.mdx'));

    await expect(adapter().read('missing.mdx')).rejects.toBeInstanceOf(
      StorageEntryNotFoundError,
    );
  });

  test('flags binary content with isBinary: true', async () => {
    // PNG signature bytes
    const binaryBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    server.use(
      handlers.getContent('acme', 'site', 'public/logo.png', {
        type: 'file',
        encoding: 'base64',
        content: Buffer.from(binaryBytes).toString('base64'),
        sha: 'png-sha',
        path: 'public/logo.png',
      }),
    );

    const entry = await adapter().read('public/logo.png');

    expect(entry.isBinary).toBe(true);
    expect(entry.content).toBe(Buffer.from(binaryBytes).toString('base64'));
  });
});

describe('GithubStorageAdapter.list', () => {
  test('lists files in a directory (top-level only)', async () => {
    server.use(
      http.get(
        `${API}/repos/acme/site/contents/${encodeContentPath('src/content/posts')}`,
        () =>
          HttpResponse.json([
            { type: 'file', path: 'src/content/posts/a.mdx', sha: 'sha-a', name: 'a.mdx' },
            { type: 'file', path: 'src/content/posts/b.mdx', sha: 'sha-b', name: 'b.mdx' },
            { type: 'dir', path: 'src/content/posts/archive', sha: 'sha-dir', name: 'archive' },
          ]),
      ),
    );

    const entries = await adapter().list('src/content/posts');

    expect(entries).toHaveLength(2); // directory skipped
    expect(entries[0]).toMatchObject({
      path: 'src/content/posts/a.mdx',
      revision: 'sha-a',
      isBinary: false,
    });
  });

  test('returns empty array for empty directories', async () => {
    server.use(
      http.get(
        `${API}/repos/acme/site/contents/${encodeContentPath('src/content/empty')}`,
        () => HttpResponse.json([]),
      ),
    );

    const entries = await adapter().list('src/content/empty');
    expect(entries).toEqual([]);
  });
});

describe('GithubStorageAdapter.write', () => {
  test('creates a new file when it does not exist', async () => {
    server.use(
      handlers.getContentMissing('acme', 'site', 'src/content/new.mdx'),
      handlers.putContent('acme', 'site', 'src/content/new.mdx', 'new-sha'),
    );

    const result = await adapter().write(
      'src/content/new.mdx',
      '# New\n',
      { message: 'feat: add new file' },
    );

    expect(result).toEqual({
      path: 'src/content/new.mdx',
      revision: 'new-sha',
    });
  });

  test('updates an existing file, passing its sha', async () => {
    server.use(
      handlers.getContent('acme', 'site', 'src/content/existing.mdx', {
        type: 'file',
        encoding: 'base64',
        content: Buffer.from('original\n').toString('base64'),
        sha: 'existing-sha',
        path: 'src/content/existing.mdx',
      }),
      handlers.putContent('acme', 'site', 'src/content/existing.mdx', 'updated-sha'),
    );

    const result = await adapter().write(
      'src/content/existing.mdx',
      '# Updated\n',
    );

    expect(result.revision).toBe('updated-sha');
  });
});
