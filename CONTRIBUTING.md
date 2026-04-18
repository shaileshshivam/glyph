# Contributing to Glyph

Thanks for considering a contribution. This project is in early development — the public API is still shaping.

## Local development

Requires Node 22.12+ and pnpm 10+.

```bash
pnpm install
pnpm build
pnpm test
```

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/). Format:

- `feat: add X`
- `fix: correct Y`
- `chore: update Z`
- `docs: clarify W`
- `refactor: simplify V`
- `test: cover U`

## Changesets

Any PR that changes a package's behavior requires a changeset:

```bash
pnpm changeset
```

Follow the prompt — pick affected packages, semver bump, describe the change.

## Pull requests

1. Fork and branch
2. Make changes with tests
3. Run `pnpm ci` locally
4. Add a changeset if applicable
5. Open the PR

We'll review and iterate together.
