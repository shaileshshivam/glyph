import { describe, expect, test } from 'vitest';
import { StorageEntryNotFoundError } from '@glyph/core';
import { createGithubStorageAdapter } from './adapter';
import { server, handlers } from './__tests__/mocks';

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
