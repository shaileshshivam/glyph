/**
 * MediaAdapter — stores user-uploaded assets (images, videos, files).
 *
 * Media lives separately from content so adopters can choose their
 * storage tier: commit into the repo (cheap, versioned),
 * push to object storage (fast, cheap at scale), use a CDN service
 * (fastest, most expensive).
 */
export interface MediaAdapter {
  /**
   * Upload an asset. Returns a reference the editor can insert
   * (typically a public URL or a path resolveUrl() will expand).
   */
  upload(upload: MediaUpload): Promise<MediaAsset>;

  /** Delete an asset by its URL or path. No-op if it doesn't exist. */
  delete(urlOrPath: string): Promise<void>;

  /**
   * Convert a relative path (as stored in content) into a
   * fully-qualified URL safe for rendering.
   */
  resolveUrl(path: string): string;
}

export interface MediaUpload {
  /** Filename as chosen by the user (without path). */
  filename: string;
  /** MIME type, e.g. "image/png". */
  contentType: string;
  /** File bytes. */
  bytes: Uint8Array;
  /** Optional alt text. */
  alt?: string;
  /** Optional subdirectory within the media root. */
  directory?: string;
}

export interface MediaAsset {
  /** Path/URL the editor should insert into content. */
  url: string;
  /** Storage-relative path (useful for delete). */
  path: string;
  /** Size in bytes. */
  size: number;
  /** Content type echoed back. */
  contentType: string;
}
