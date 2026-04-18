import { assertType, test } from 'vitest';
import type { MediaAdapter, MediaUpload, MediaAsset } from './media';

test('MediaAdapter has the expected shape', () => {
  const adapter = {} as MediaAdapter;

  assertType<(upload: MediaUpload) => Promise<MediaAsset>>(adapter.upload);
  assertType<(url: string) => Promise<void>>(adapter.delete);
  assertType<(path: string) => string>(adapter.resolveUrl);
});
