import { describe, expect, test } from 'vitest';
import { createGitHubClient } from './client';

describe('createGitHubClient', () => {
  test('returns an Octokit instance bound to the provided token', () => {
    const client = createGitHubClient({ token: 'test-token' });
    expect(client).toBeDefined();
    expect(typeof client.rest.repos.getContent).toBe('function');
  });

  test('allows overriding the base URL for GitHub Enterprise', () => {
    const client = createGitHubClient({
      token: 'x',
      baseUrl: 'https://ghe.example.com/api/v3',
    });
    expect(client).toBeDefined();
  });
});
