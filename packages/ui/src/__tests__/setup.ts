import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom polyfills required by Base UI primitives (floating-ui + pointer).
if (typeof window !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = function hasPointerCapture() {
      return false;
    };
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function setPointerCapture() {
      /* noop */
    };
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function releasePointerCapture() {
      /* noop */
    };
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function scrollIntoView() {
      /* noop */
    };
  }
  // jsdom polyfills required by CodeMirror's text measurement.
  // Only polyfill if missing — do not override native implementations used by
  // Base UI's floating-ui positioning.
  if (typeof Range !== 'undefined') {
    const rangeProto = Range.prototype as unknown as {
      getClientRects?: () => DOMRectList;
      getBoundingClientRect?: () => DOMRect;
    };
    const fakeRect: DOMRect = {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      toJSON() {
        return {};
      },
    };
    const fakeRectList = Object.assign([] as unknown as DOMRect[], {
      item: (_index: number): DOMRect | null => null,
    }) as unknown as DOMRectList;
    if (typeof rangeProto.getClientRects !== 'function') {
      rangeProto.getClientRects = () => fakeRectList;
    }
    if (typeof rangeProto.getBoundingClientRect !== 'function') {
      rangeProto.getBoundingClientRect = () => fakeRect;
    }
  }
}
