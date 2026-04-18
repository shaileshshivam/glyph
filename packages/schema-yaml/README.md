# @glyph/schema-yaml

SchemaAdapter for Glyph — parses YAML collection schemas into `CollectionSchema[]`.

## Install

```bash
pnpm add @glyph/schema-yaml @glyph/core
```

## Usage

Create `glyph.collections.yml` at your repo root:

```yaml
collections:
  posts:
    label: Writing
    folder: src/content/posts
    extension: mdx
    fields:
      - { name: title, type: string, required: true }
      - { name: date, type: date, required: true }
      - { name: excerpt, type: text }
      - { name: tags, type: list }
      - { name: status, type: select, options: [draft, published], defaultValue: draft }
      - { name: body, type: markdown, required: true }
```

Then in `glyph.config.ts`:

```ts
import { yamlSchema } from '@glyph/schema-yaml';
export default defineConfig({
  schema: yamlSchema({ path: './glyph.collections.yml' }),
  // ...
});
```

## Supported field types

`string`, `text`, `markdown`, `number`, `boolean`, `select`, `list`, `date`, `datetime`.

## License

MIT
