import { Toast as BaseToast } from '@base-ui-components/react/toast';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
}

export interface ToastProviderProps {
  children: ReactNode;
  limit?: number;
}

interface ToastData {
  tone?: ToastOptions['tone'];
}

export function ToastProvider({ children, limit = 5 }: ToastProviderProps): ReactElement {
  return (
    <BaseToast.Provider limit={limit}>
      {children}
      <BaseToast.Viewport className="glyph-toast__viewport">
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Provider>
  );
}

export function useToast(): {
  add: (options: ToastOptions) => string;
  close: (id: string) => void;
} {
  const manager = BaseToast.useToastManager();
  return {
    add(options: ToastOptions): string {
      const { tone = 'info', duration, title, description } = options;
      return manager.add<ToastData>({
        title,
        ...(description !== undefined ? { description } : {}),
        timeout: duration ?? 4500,
        data: { tone },
      });
    },
    close(id: string): void {
      manager.close(id);
    },
  };
}

export function ToastList(): ReactElement {
  const manager = BaseToast.useToastManager();
  return (
    <>
      {manager.toasts.map((toast) => {
        const data = toast.data as ToastData | undefined;
        const tone = data?.tone ?? 'info';
        return (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            className={cn('glyph-toast', `glyph-toast--${tone}`)}
          >
            <BaseToast.Title className="glyph-toast__title" />
            <BaseToast.Description className="glyph-toast__description" />
            <BaseToast.Close className="glyph-toast__close" aria-label="Dismiss">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <title>Dismiss</title>
                <path
                  d="M2 2L10 10M10 2L2 10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </BaseToast.Close>
          </BaseToast.Root>
        );
      })}
    </>
  );
}
