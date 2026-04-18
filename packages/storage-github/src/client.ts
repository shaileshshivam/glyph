import { Octokit } from 'octokit';

export interface GitHubClientOptions {
  /** GitHub personal access token or app installation token. */
  token: string;
  /** Base URL override (for GitHub Enterprise). */
  baseUrl?: string;
  /** User agent string. */
  userAgent?: string;
}

/**
 * Creates an Octokit client configured for the given credentials.
 * Thin factory — exists so tests can stub the client without reaching
 * into Octokit's construction details.
 */
export function createGitHubClient(options: GitHubClientOptions): Octokit {
  const octokitOptions: ConstructorParameters<typeof Octokit>[0] = {
    auth: options.token,
    userAgent: options.userAgent ?? 'glyph',
  };
  if (options.baseUrl !== undefined) {
    octokitOptions.baseUrl = options.baseUrl;
  }
  return new Octokit(octokitOptions);
}
