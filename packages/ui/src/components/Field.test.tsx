import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from './Input';

describe('Field', () => {
  test('renders label + control', () => {
    render(
      <Field label="Title">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  test('associates label with input via htmlFor/id', () => {
    render(
      <Field label="Email" htmlFor="email-x">
        <Input id="email-x" />
      </Field>,
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-x');
  });

  test('marks required', () => {
    render(
      <Field label="Required" required>
        <Input />
      </Field>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('shows hint when provided', () => {
    render(
      <Field label="Tags" hint="Comma-separated">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Comma-separated')).toBeInTheDocument();
  });

  test('shows error instead of hint when provided', () => {
    render(
      <Field label="Email" hint="Work email" error="Invalid">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Invalid')).toBeInTheDocument();
    expect(screen.queryByText('Work email')).not.toBeInTheDocument();
  });
});
