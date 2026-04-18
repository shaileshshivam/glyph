import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

/**
 * Default handlers — empty. Each test installs its own via
 * server.use(...). Any request without an explicit handler fails
 * the test (onUnhandledRequest: 'error').
 */
export const server = setupServer();

/** Helper — shared realistic base URL for Octokit. */
export const API = 'https://api.github.com';

/** Handler generators for common GitHub API shapes. */
export const handlers = {
  getContent: (owner: string, repo: string, path: string, response: unknown) =>
    http.get(`${API}/repos/${owner}/${repo}/contents/${path}`, () =>
      HttpResponse.json(response),
    ),

  getContentMissing: (owner: string, repo: string, path: string) =>
    http.get(`${API}/repos/${owner}/${repo}/contents/${path}`, () =>
      HttpResponse.json({ message: 'Not Found' }, { status: 404 }),
    ),

  getBranch: (owner: string, repo: string, branch: string, sha: string) =>
    http.get(`${API}/repos/${owner}/${repo}/branches/${branch}`, () =>
      HttpResponse.json({
        name: branch,
        commit: { sha },
        protected: false,
      }),
    ),

  putContent: (owner: string, repo: string, path: string, newSha: string) =>
    http.put(`${API}/repos/${owner}/${repo}/contents/${path}`, () =>
      HttpResponse.json({
        content: { path, sha: newSha, html_url: '' },
        commit: { sha: newSha, html_url: '' },
      }),
    ),

  deleteContent: (owner: string, repo: string, path: string) =>
    http.delete(`${API}/repos/${owner}/${repo}/contents/${path}`, () =>
      HttpResponse.json({ commit: { sha: 'deleted-sha' } }),
    ),
};
