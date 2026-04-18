import { Fish, Lotus, Peacock, Surya, Yantra } from '@glyph/theme-mithila';
import {
  Button,
  CodeEditor,
  Dialog,
  Field,
  Input,
  Select,
  Textarea,
  ToastProvider,
  useToast,
} from '@glyph/ui';
import { useState } from 'react';

function ToastDemo() {
  const { add } = useToast();
  return (
    <Button
      onClick={() => add({ title: 'Committed', description: 'Live in ~25s', tone: 'success' })}
    >
      Trigger toast
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'var(--glyph-font-display)', fontSize: 22, marginBottom: 16 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {children}
      </div>
    </section>
  );
}

export function App() {
  const [markdown, setMarkdown] = useState('# Hello, Glyph\n\nA CMS that fits your stack.');
  const [select, setSelect] = useState('draft');

  return (
    <ToastProvider>
      <div className="glyph-root" style={{ maxWidth: 860, margin: '48px auto', padding: 24 }}>
        <h1 style={{ fontFamily: 'var(--glyph-font-display)', fontSize: 36, marginBottom: 32 }}>
          Glyph UI — Preview
        </h1>

        <Section title="Buttons">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </Section>

        <Section title="Fields">
          <div style={{ width: 320 }}>
            <Field label="Title" required>
              <Input placeholder="Essay title" />
            </Field>
          </div>
          <div style={{ width: 320 }}>
            <Field label="Excerpt" hint="One or two sentences">
              <Textarea placeholder="Body…" />
            </Field>
          </div>
          <div style={{ width: 200 }}>
            <Field label="Status" htmlFor="status">
              <Select
                id="status"
                value={select}
                onValueChange={setSelect}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ]}
              />
            </Field>
          </div>
        </Section>

        <Section title="Dialog">
          <Dialog
            title="Delete entry"
            description="This is irreversible. The file will be committed as deleted."
            trigger={<Button variant="secondary">Open dialog</Button>}
            footer={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button>Delete</Button>
              </>
            }
          >
            <p>Type the slug to confirm.</p>
          </Dialog>
        </Section>

        <Section title="Toast">
          <ToastDemo />
        </Section>

        <Section title="Code editor">
          <div style={{ width: '100%' }}>
            <CodeEditor value={markdown} onChange={setMarkdown} />
          </div>
        </Section>

        <Section title="Glyph motifs">
          <Lotus style={{ color: 'var(--glyph-accent)' }} />
          <Peacock style={{ color: 'var(--glyph-warning)' }} />
          <Fish style={{ color: 'var(--glyph-success)' }} />
          <Surya style={{ color: 'var(--glyph-accent)' }} />
          <Yantra style={{ color: 'var(--glyph-warning)' }} />
        </Section>
      </div>
    </ToastProvider>
  );
}
