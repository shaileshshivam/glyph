/**
 * SchemaAdapter — translates user-authored schema definitions into
 * Glyph's internal CollectionSchema shape.
 *
 * Users may define collections in TypeScript (Zod), YAML, JSON — each
 * flavour has its own adapter. The adapter's job is to normalize into
 * a common CollectionSchema that the UI, form generator, and validator
 * all consume.
 */
export interface SchemaAdapter {
  /**
   * Parse a raw schema source (file contents or identifier) into one
   * or more collection schemas.
   */
  parse(source: string): Promise<CollectionSchema[]>;

  /** Validate an entry against its collection schema. */
  validate(entry: unknown, schema: CollectionSchema): ValidationResult;

  /** Produce a fresh entry pre-filled with schema defaults. */
  getDefaults(schema: CollectionSchema): Record<string, unknown>;
}

export interface CollectionSchema {
  /** Machine name (used in paths and APIs). */
  name: string;
  /** Display label. */
  label: string;
  /** Singular form for UI copy. */
  labelSingular?: string;
  /** Folder holding entries within the workspace. */
  folder: string;
  /** File extension ("mdx", "md", "yaml"). */
  extension: string;
  /** How entries are stored — frontmatter, plain markdown, JSON, etc. */
  format: 'frontmatter' | 'markdown' | 'json' | 'yaml' | 'raw';
  /** Ordered list of fields. */
  fields: FieldSchema[];
  /** Optional description for the UI. */
  description?: string;
  /** Slug template using {{field}} tokens. Defaults to "{{slug}}". */
  slugTemplate?: string;
}

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  defaultValue?: unknown;
  /** Type-specific options (enum values, regex, etc.). */
  options?: Record<string, unknown>;
}

export type FieldType =
  | 'string'
  | 'text'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'select'
  | 'list'
  | 'date'
  | 'datetime'
  | 'image'
  | 'relation'
  | 'object'
  | string; // custom widget types via plugins

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  /** Dot-path into the entry, e.g. "title" or "meta.tags[0]". */
  path: string;
  message: string;
}
