/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {
  ResponderTouchHistoryStore,
  TouchHistory
} from './ResponderTouchHistoryStore';
import type { TouchEvent } from './ResponderEventTypes';

import getBoundingClientRect from '../../modules/getBoundingClientRect';

export type ResponderEvent = {|
  bubbles: boolean,
  cancelable: boolean,
  currentTarget: any,
  defaultPrevented: ?boolean,
  dispatchConfig: {
    registrationName?: string,
    phasedRegistrationNames?: {
      bubbled: string,
      captured: string
    }
  },
  eventPhase: ?number,
  isDefaultPrevented: () => boolean,
  isPropagationStopped: () => boolean,
  isTrusted: ?boolean,
  preventDefault: () => void,
  stopPropagation: () => void,
  nativeEvent: TouchEvent,
  persist: () => void,
  target: ?any,
  timeStamp: number,
  touchHistory: TouchHistory
|};

const emptyFunction = () => {};
const emptyObject = {};
const emptyArray = [];

/**
 * Safari produces very large identifiers that would cause the `touchBank` array
 * length to be so large as to crash the browser, if not normalized like this.
 * In the future the `touchBank` should use an object/map instead.
 */
function normalizeIdentifier(identifier) {
  return identifier > 20 ? identifier % 20 : identifier;
}

/**
 * Converts a native DOM event to a ResponderEvent.
 * Mouse events are transformed into fake touch events.
 */
export default function createResponderEvent(
  domEvent: any,
  responderTouchHistoryStore: ResponderTouchHistoryStore
): ResponderEvent {
  let rect;
  let propagationWasStopped = false;
  let changedTouches;
  let touches;

  const domEventChangedTouches = domEvent.changedTouches;
  const domEventType = domEvent.type;

  const metaKey = domEvent.metaKey === true;
  const shiftKey = domEvent.shiftKey === true;
  const force =
    (domEventChangedTouches && domEventChangedTouches[0].force) || 0;
  const identifier = normalizeIdentifier(
    (domEventChangedTouches && domEventChangedTouches[0].identifier) || 0
  );
  const clientX =
    (domEventChangedTouches && domEventChangedTouches[0].clientX) ||
    domEvent.clientX;
  const clientY =
    (domEventChangedTouches && domEventChangedTouches[0].clientY) ||
    domEvent.clientY;
  const pageX =
    (domEventChangedTouches && domEventChangedTouches[0].pageX) ||
    domEvent.pageX;
  const pageY =
    (domEventChangedTouches && domEventChangedTouches[0].pageY) ||
    domEvent.pageY;
  const preventDefault =
    typeof domEvent.preventDefault === 'function'
      ? domEvent.preventDefault.bind(domEvent)
      : emptyFunction;
  const timestamp = domEvent.timeStamp;

  function normalizeTouches(touches) {
    return Array.prototype.slice.call(touches).map((touch) => {
      return {
        force: touch.force,
        identifier: normalizeIdentifier(touch.identifier),
        get locationX() {
          return locationX(touch.clientX);
        },
        get locationY() {
          return locationY(touch.clientY);
        },
        pageX: touch.pageX,
        pageY: touch.pageY,
        target: touch.target,
        timestamp
      };
    });
  }

  if (domEventChangedTouches != null) {
    changedTouches = normalizeTouches(domEventChangedTouches);
    touches = normalizeTouches(domEvent.touches);
  } else {
    const emulatedTouches = [
      {
        force,
        identifier,
        get locationX() {
          return locationX(clientX);
        },
        get locationY() {
          return locationY(clientY);
        },
        pageX,
        pageY,
        target: domEvent.target,
        timestamp
      }
    ];
    changedTouches = emulatedTouches;
    touches =
      domEventType === 'mouseup' || domEventType === 'dragstart'
        ? emptyArray
        : emulatedTouches;
  }

  const responderEvent = {
    bubbles: true,
    cancelable: true,
    // `currentTarget` is set before dispatch
    currentTarget: null,
    defaultPrevented: domEvent.defaultPrevented,
    dispatchConfig: emptyObject,
    eventPhase: domEvent.eventPhase,
    isDefaultPrevented() {
      return domEvent.defaultPrevented;
    },
    isPropagationStopped() {
      return propagationWasStopped;
    },
    isTrusted: domEvent.isTrusted,
    nativeEvent: {
      altKey: false,
      ctrlKey: false,
      metaKey,
      shiftKey,
      changedTouches,
      force,
      identifier,
      get locationX() {
        return locationX(clientX);
      },
      get locationY() {
        return locationY(clientY);
      },
      pageX,
      pageY,
      target: domEvent.target,
      timestamp,
      touches,
      type: domEventType
    },
    persist: emptyFunction,
    preventDefault,
    stopPropagation() {
      propagationWasStopped = true;
    },
    target: domEvent.target,
    timeStamp: timestamp,
    touchHistory: responderTouchHistoryStore.touchHistory
  };

  // Using getters and functions serves two purposes:
  // 1) The value of `currentTarget` is not initially available.
  // 2) Measuring the clientRect may cause layout jank and should only be done on-demand.
  function locationX(x) {
    rect = rect || getBoundingClientRect(responderEvent.currentTarget);
    if (rect) {
      return x - rect.left;
    }
  }
  function locationY(y) {
    rect = rect || getBoundingClientRect(responderEvent.currentTarget);
    if (rect) {
      return y - rect.top;
    }
  }

  return responderEvent;
}
