import { Button, Dialog, useToast } from '@glyph/ui';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EntryDetail } from '../server/getEntry';
import { deleteEntry } from '../server/deleteEntry';
import { saveEntry } from '../server/saveEntry';
import { FormGenerator } from './FormGenerator';
import { MarkdownWidget } from './widgets/MarkdownWidget';

export interface EntryEditorProps {
  entry: EntryDetail;
  isNew?: boolean;
}

export function EntryEditor({ entry, isNew = false }: EntryEditorProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const { add: addToast } = useToast();

  const [frontmatter, setFrontmatter] = useState<Record<string, unknown>>(
    entry.frontmatter,
  );
  const [body, setBody] = useState<string>(entry.body);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [saving, setSaving] = useState(false);
  const [baseline] = useState(() => ({
    fm: JSON.stringify(entry.frontmatter),
    body: entry.body,
  }));

  const markdownField = useMemo(
    () => entry.schema?.fields.find((f) => f.type === 'markdown') ?? null,
    [entry.schema],
  );

  const isDirty = useMemo(
    () =>
      JSON.stringify(frontmatter) !== baseline.fm || body !== baseline.body,
    [frontmatter, body, baseline],
  );

  // beforeunload warning
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const validate = useCallback((): boolean => {
    const next: Record<string, string | undefined> = {};
    if (entry.schema !== null) {
      for (const field of entry.schema.fields) {
        if (field.type === 'markdown') continue;
        if (field.required === true) {
          const v = frontmatter[field.name];
          if (
            v === undefined ||
            v === null ||
            v === '' ||
            (Array.isArray(v) && v.length === 0)
          ) {
            next[field.name] = 'Required';
          }
        }
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [entry.schema, frontmatter]);

  const save = useCallback(
    async (publish: boolean) => {
      if (!validate()) {
        addToast({ title: 'Fix errors first', tone: 'danger' });
        return;
      }
      setSaving(true);
      try {
        const result = await saveEntry({
          data: {
            collection: entry.collection,
            slug: entry.slug,
            frontmatter,
            body,
            publish,
            isNew,
          },
        });
        addToast({
          title: publish ? 'Published' : 'Saved draft',
          description: `Revision ${result.revision.slice(0, 7)}`,
          tone: 'success',
        });
        if (isNew) {
          navigate({
            to: '/collections/$name/$slug',
            params: { name: entry.collection, slug: entry.slug },
          });
        } else {
          await router.invalidate();
        }
      } catch (err) {
        addToast({
          title: 'Save failed',
          description: err instanceof Error ? err.message : 'Unknown error',
          tone: 'danger',
        });
      } finally {
        setSaving(false);
      }
    },
    [
      validate,
      frontmatter,
      body,
      entry.collection,
      entry.slug,
      isNew,
      addToast,
      router,
      navigate,
    ],
  );

  // cmd+s = save draft, cmd+shift+p = publish
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 's') {
        e.preventDefault();
        void save(false);
      } else if (mod && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        void save(true);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  async function handleDelete() {
    try {
      await deleteEntry({
        data: { collection: entry.collection, slug: entry.slug },
      });
      addToast({ title: 'Deleted', tone: 'info' });
      navigate({
        to: '/collections/$name',
        params: { name: entry.collection },
      });
    } catch (err) {
      addToast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        tone: 'danger',
      });
    }
  }

  const setField = (name: string, value: unknown) => {
    setFrontmatter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glyph-editor-layout">
      <header className="glyph-editor-layout__toolbar">
        <div className="glyph-editor-layout__title">
          <span className="glyph-editor-layout__collection">
            {entry.collection}
          </span>
          <span className="glyph-editor-layout__slug">{entry.slug}</span>
          {isDirty && (
            <span className="glyph-editor-layout__dirty">• unsaved</span>
          )}
        </div>
        <div className="glyph-editor-layout__actions">
          <Button
            variant="ghost"
            onClick={() => void save(false)}
            disabled={saving || !isDirty}
          >
            Save draft
          </Button>
          <Button onClick={() => void save(true)} disabled={saving}>
            Publish
          </Button>
          {!isNew && (
            <Dialog
              title="Delete entry"
              description="This commits a deletion. Type the slug below to confirm."
              trigger={
                <Button variant="ghost" size="sm">
                  Delete
                </Button>
              }
              footer={
                <DeleteConfirm
                  slug={entry.slug}
                  onConfirm={() => void handleDelete()}
                />
              }
            >
              <p>
                This is irreversible in the UI (but it's in git history, of
                course).
              </p>
            </Dialog>
          )}
        </div>
      </header>

      <div className="glyph-editor-layout__panes">
        <aside className="glyph-editor-layout__form">
          {entry.schema !== null ? (
            <FormGenerator
              schema={entry.schema}
              values={frontmatter}
              errors={errors}
              onChange={setField}
            />
          ) : (
            <p>No schema configured for collection “{entry.collection}”.</p>
          )}
        </aside>
        <section className="glyph-editor-layout__body">
          {markdownField !== null ? (
            <MarkdownWidget
              field={markdownField}
              value={body}
              onChange={(v) => setBody(v ?? '')}
            />
          ) : (
            <p className="glyph-editor-layout__note">
              No markdown field in schema.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function DeleteConfirm({
  slug,
  onConfirm,
}: {
  slug: string;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState('');
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="text"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder={slug}
        style={{
          flex: 1,
          padding: '6px 8px',
          fontFamily: 'var(--glyph-font-mono)',
        }}
      />
      <Button onClick={onConfirm} disabled={typed !== slug}>
        Delete
      </Button>
    </div>
  );
}
