import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { CodeEditor } from './CodeEditor';

describe('CodeEditor', () => {
  test('renders with initial value', () => {
    const { container } = render(<CodeEditor value="# Hello" />);
    const content = container.querySelector('.cm-content');
    expect(content).not.toBeNull();
    expect(content?.textContent ?? '').toContain('# Hello');
  });

  test('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<CodeEditor value="" onChange={onChange} />);
    const el = container.querySelector('.cm-content');
    expect(el).not.toBeNull();
    await user.click(el as HTMLElement);
    await user.keyboard('hello');
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining('hello'));
  });
});
