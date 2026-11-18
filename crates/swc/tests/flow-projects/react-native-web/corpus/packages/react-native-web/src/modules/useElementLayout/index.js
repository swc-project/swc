/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ElementRef } from 'react';
import type { LayoutEvent } from '../../types';

import useLayoutEffect from '../useLayoutEffect';
import UIManager from '../../exports/UIManager';
import canUseDOM from '../canUseDom';

const DOM_LAYOUT_HANDLER_NAME = '__reactLayoutHandler';

let didWarn = !canUseDOM;
let resizeObserver = null;

function getResizeObserver(): ?ResizeObserver {
  if (canUseDOM && typeof window.ResizeObserver !== 'undefined') {
    if (resizeObserver == null) {
      resizeObserver = new window.ResizeObserver(function (entries) {
        entries.forEach((entry) => {
          const node = entry.target;
          const onLayout = node[DOM_LAYOUT_HANDLER_NAME];
          if (typeof onLayout === 'function') {
            // We still need to measure the view because browsers don't yet provide
            // border-box dimensions in the entry
            UIManager.measure(node, (x, y, width, height, left, top) => {
              const event: LayoutEvent = {
                // $FlowFixMe
                nativeEvent: {
                  layout: { x, y, width, height, left, top }
                },
                timeStamp: Date.now()
              };
              Object.defineProperty(event.nativeEvent, 'target', {
                enumerable: true,
                get: () => entry.target
              });
              onLayout(event);
            });
          }
        });
      });
    }
  } else if (!didWarn) {
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test'
    ) {
      console.warn(
        'onLayout relies on ResizeObserver which is not supported by your browser. ' +
          'Please include a polyfill, e.g., https://github.com/que-etc/resize-observer-polyfill.'
      );
      didWarn = true;
    }
  }
  return resizeObserver;
}

export default function useElementLayout(
  ref: ElementRef<any>,
  onLayout?: ?(e: LayoutEvent) => void
) {
  const observer = getResizeObserver();

  useLayoutEffect(() => {
    const node = ref.current;
    if (node != null) {
      node[DOM_LAYOUT_HANDLER_NAME] = onLayout;
    }
  }, [ref, onLayout]);

  // Observing is done in a separate effect to avoid this effect running
  // when 'onLayout' changes.
  useLayoutEffect(() => {
    const node = ref.current;
    if (node != null && observer != null) {
      if (typeof node[DOM_LAYOUT_HANDLER_NAME] === 'function') {
        observer.observe(node);
      } else {
        observer.unobserve(node);
      }
    }
    return () => {
      if (node != null && observer != null) {
        observer.unobserve(node);
      }
    };
  }, [ref, observer]);
}
