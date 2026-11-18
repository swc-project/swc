/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { getModality } from '../modality';
import useEvent from '../useEvent';
import useLayoutEffect from '../useLayoutEffect';

/**
 * Types
 */

export type HoverEventsConfig = {
  contain?: ?boolean,
  disabled?: ?boolean,
  onHoverStart?: ?(e: any) => void,
  onHoverChange?: ?(bool: boolean) => void,
  onHoverUpdate?: ?(e: any) => void,
  onHoverEnd?: ?(e: any) => void
};

/**
 * Implementation
 */

const emptyObject = {};
const opts = { passive: true };
const lockEventType = 'react-gui:hover:lock';
const unlockEventType = 'react-gui:hover:unlock';
const supportsPointerEvent = () =>
  !!(typeof window !== 'undefined' && window.PointerEvent != null);

function dispatchCustomEvent(
  target: EventTarget,
  type: string,
  payload?: {
    bubbles?: boolean,
    cancelable?: boolean,
    detail?: { [key: string]: mixed }
  }
) {
  const event = document.createEvent('CustomEvent');
  const { bubbles = true, cancelable = true, detail } = payload || emptyObject;
  event.initCustomEvent(type, bubbles, cancelable, detail);
  target.dispatchEvent(event);
}

// This accounts for the non-PointerEvent fallback events.
function getPointerType(event) {
  const { pointerType } = event;
  return pointerType != null ? pointerType : getModality();
}

export default function useHover(
  targetRef: any,
  config: HoverEventsConfig
): void {
  const {
    contain,
    disabled,
    onHoverStart,
    onHoverChange,
    onHoverUpdate,
    onHoverEnd
  } = config;

  const canUsePE = supportsPointerEvent();

  const addMoveListener = useEvent(
    canUsePE ? 'pointermove' : 'mousemove',
    opts
  );
  const addEnterListener = useEvent(
    canUsePE ? 'pointerenter' : 'mouseenter',
    opts
  );
  const addLeaveListener = useEvent(
    canUsePE ? 'pointerleave' : 'mouseleave',
    opts
  );
  // These custom events are used to implement the "contain" prop.
  const addLockListener = useEvent(lockEventType, opts);
  const addUnlockListener = useEvent(unlockEventType, opts);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (target !== null) {
      /**
       * End the hover gesture
       */
      const hoverEnd = function (e) {
        if (onHoverEnd != null) {
          onHoverEnd(e);
        }
        if (onHoverChange != null) {
          onHoverChange(false);
        }
        // Remove the listeners once finished.
        addMoveListener(target, null);
        addLeaveListener(target, null);
      };

      /**
       * Leave element
       */
      const leaveListener = function (e) {
        const target = targetRef.current;
        if (target != null && getPointerType(e) !== 'touch') {
          if (contain) {
            dispatchCustomEvent(target, unlockEventType);
          }
          hoverEnd(e);
        }
      };

      /**
       * Move within element
       */
      const moveListener = function (e) {
        if (getPointerType(e) !== 'touch') {
          if (onHoverUpdate != null) {
            // Not all browsers have these properties
            if (e.x == null) {
              e.x = e.clientX;
            }
            if (e.y == null) {
              e.y = e.clientY;
            }
            onHoverUpdate(e);
          }
        }
      };

      /**
       * Start the hover gesture
       */
      const hoverStart = function (e) {
        if (onHoverStart != null) {
          onHoverStart(e);
        }
        if (onHoverChange != null) {
          onHoverChange(true);
        }
        // Set the listeners needed for the rest of the hover gesture.
        if (onHoverUpdate != null) {
          addMoveListener(target, !disabled ? moveListener : null);
        }
        addLeaveListener(target, !disabled ? leaveListener : null);
      };

      /**
       * Enter element
       */
      const enterListener = function (e) {
        const target = targetRef.current;
        if (target != null && getPointerType(e) !== 'touch') {
          if (contain) {
            dispatchCustomEvent(target, lockEventType);
          }
          hoverStart(e);
          const lockListener = function (lockEvent) {
            if (lockEvent.target !== target) {
              hoverEnd(e);
            }
          };
          const unlockListener = function (lockEvent) {
            if (lockEvent.target !== target) {
              hoverStart(e);
            }
          };
          addLockListener(target, !disabled ? lockListener : null);
          addUnlockListener(target, !disabled ? unlockListener : null);
        }
      };

      addEnterListener(target, !disabled ? enterListener : null);
    }
  }, [
    addEnterListener,
    addMoveListener,
    addLeaveListener,
    addLockListener,
    addUnlockListener,
    contain,
    disabled,
    onHoverStart,
    onHoverChange,
    onHoverUpdate,
    onHoverEnd,
    targetRef
  ]);
}
