# @glyph/storage-github

A `StorageAdapter` for Glyph that reads and writes content in a GitHub repository.

## Install

```bash
pnpm add @glyph/storage-github @glyph/core
```

## Usage

```ts
import { defineConfig } from '@glyph/core';
import { githubStorage } from '@glyph/storage-github';

export default defineConfig({
  storage: githubStorage({
    owner: 'your-org',
    repo: 'your-repo',
    branch: 'main',
    token: process.env.GITHUB_TOKEN!,
    contentRoot: 'src/content',
  }),
});
```

## Options

| Option | Type | Default | Notes |
|---|---|---|---|
| `owner` | `string` | required | GitHub org or user. |
| `repo` | `string` | required | Repository name. |
| `branch` | `string` | `"main"` | Branch to read/write. |
| `token` | `string` | required | Personal access token with `contents:write` on the target repo. |
| `contentRoot` | `string` | `""` | Path prefix prepended to all entry paths. |
| `author` | `{name, email}` | — | Default commit author. |

## License

MIT
