/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * RESPONDER EVENT SYSTEM
 *
 * A single, global "interaction lock" on views. For a view to be the "responder" means
 * that pointer interactions are exclusive to that view and none other. The "interaction
 * lock" can be transferred (only) to ancestors of the current "responder" as long as
 * pointers continue to be active.
 *
 * Responder being granted:
 *
 * A view can become the "responder" after the following events:
 *  * "pointerdown" (implemented using "touchstart", "mousedown")
 *  * "pointermove" (implemented using "touchmove", "mousemove")
 *  * "scroll" (while a pointer is down)
 *  * "selectionchange" (while a pointer is down)
 *
 * If nothing is already the "responder", the event propagates to (capture) and from
 * (bubble) the event target until a view returns `true` for
 * `on*ShouldSetResponder(Capture)`.
 *
 * If something is already the responder, the event propagates to (capture) and from
 * (bubble) the lowest common ancestor of the event target and the current "responder".
 * Then negotiation happens between the current "responder" and a view that wants to
 * become the "responder": see the timing diagram below.
 *
 * (NOTE: Scrolled views either automatically become the "responder" or release the
 * "interaction lock". A native scroll view that isn't built on top of the responder
 * system must result in the current "responder" being notified that it no longer has
 * the "interaction lock" - the native system has taken over.
 *
 * Responder being released:
 *
 * As soon as there are no more active pointers that *started* inside descendants
 * of the *current* "responder", an `onResponderRelease` event is dispatched to the
 * current "responder", and the responder lock is released.
 *
 * Typical sequence of events:
 *  * startShouldSetResponder
 *  * responderGrant/Reject
 *  * responderStart
 *  * responderMove
 *  * responderEnd
 *  * responderRelease
 */

/*                                             Negotiation Performed
                                             +-----------------------+
                                            /                         \
Process low level events to    +     Current Responder      +   wantsResponderID
determine who to perform negot-|   (if any exists at all)   |
iation/transition              | Otherwise just pass through|
-------------------------------+----------------------------+------------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +--------------+          |                            |
     | onTouchStart |          |                            |
     +------+-------+    none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onStartShouldSetResponder|----->| onResponderStart (cur) |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | | onResponder            | |
            +------------------->|    TerminationRequest  | |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | | onResponderTerminate   |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderStart|
                               |                            | +----------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchMove |           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onMoveShouldSetResponder |----->| onResponderMove (cur)  |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderMove |
                               |                            | +----------------+
                               |                            |
                               |                            |
      Some active touch started|                            |
      inside current responder | +------------------------+ |
      +------------------------->|      onResponderEnd    | |
      |                        | +------------------------+ |
  +---+---------+              |                            |
  | onTouchEnd  |              |                            |
  +---+---------+              |                            |
      |                        | +------------------------+ |
      +------------------------->|     onResponderEnd     | |
      No active touches started| +-----------+------------+ |
      inside current responder |             |              |
                               |             v              |
                               | +------------------------+ |
                               | |    onResponderRelease  | |
                               | +------------------------+ |
                               |                            |
                               +                            + */

import type { ResponderEvent } from './createResponderEvent';

import createResponderEvent from './createResponderEvent';
import {
  isCancelish,
  isEndish,
  isMoveish,
  isScroll,
  isSelectionChange,
  isStartish
} from './ResponderEventTypes';
import {
  getLowestCommonAncestor,
  getResponderPaths,
  hasTargetTouches,
  hasValidSelection,
  isPrimaryPointerDown,
  setResponderId
} from './utils';
import { ResponderTouchHistoryStore } from './ResponderTouchHistoryStore';
import canUseDOM from '../canUseDom';

/* ------------ TYPES ------------ */

type ResponderId = number;

type ActiveResponderInstance = {
  id: ResponderId,
  idPath: Array<number>,
  node: any
};

type EmptyResponderInstance = {
  id: null,
  idPath: null,
  node: null
};

type ResponderInstance = ActiveResponderInstance | EmptyResponderInstance;

export type ResponderConfig = {
  // Direct responder events dispatched directly to responder. Do not bubble.
  onResponderEnd?: ?(e: ResponderEvent) => void,
  onResponderGrant?: ?(e: ResponderEvent) => void | boolean,
  onResponderMove?: ?(e: ResponderEvent) => void,
  onResponderRelease?: ?(e: ResponderEvent) => void,
  onResponderReject?: ?(e: ResponderEvent) => void,
  onResponderStart?: ?(e: ResponderEvent) => void,
  onResponderTerminate?: ?(e: ResponderEvent) => void,
  onResponderTerminationRequest?: ?(e: ResponderEvent) => boolean,
  // On pointer down, should this element become the responder?
  onStartShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onStartShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On pointer move, should this element become the responder?
  onMoveShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onMoveShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On scroll, should this element become the responder? Do no bubble
  onScrollShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onScrollShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean,
  // On text selection change, should this element become the responder?
  onSelectionChangeShouldSetResponder?: ?(e: ResponderEvent) => boolean,
  onSelectionChangeShouldSetResponderCapture?: ?(e: ResponderEvent) => boolean
};

const emptyObject = {};

/* ------------ IMPLEMENTATION ------------ */

const startRegistration = [
  'onStartShouldSetResponderCapture',
  'onStartShouldSetResponder',
  { bubbles: true }
];
const moveRegistration = [
  'onMoveShouldSetResponderCapture',
  'onMoveShouldSetResponder',
  { bubbles: true }
];
const scrollRegistration = [
  'onScrollShouldSetResponderCapture',
  'onScrollShouldSetResponder',
  { bubbles: false }
];
const shouldSetResponderEvents = {
  touchstart: startRegistration,
  mousedown: startRegistration,
  touchmove: moveRegistration,
  mousemove: moveRegistration,
  scroll: scrollRegistration
};

const emptyResponder = { id: null, idPath: null, node: null };
const responderListenersMap = new Map();

let isEmulatingMouseEvents = false;
let trackedTouchCount = 0;
let currentResponder: ResponderInstance = {
  id: null,
  node: null,
  idPath: null
};
const responderTouchHistoryStore = new ResponderTouchHistoryStore();

function changeCurrentResponder(responder: ResponderInstance) {
  currentResponder = responder;
}

function getResponderConfig(id: ResponderId): ResponderConfig | Object {
  const config = responderListenersMap.get(id);
  return config != null ? config : emptyObject;
}

/**
 * Process native events
 *
 * A single event listener is used to manage the responder system.
 * All pointers are tracked in the ResponderTouchHistoryStore. Native events
 * are interpreted in terms of the Responder System and checked to see if
 * the responder should be transferred. Each host node that is attached to
 * the Responder System has an ID, which is used to look up its associated
 * callbacks.
 */
function eventListener(domEvent: any) {
  const eventType = domEvent.type;
  const eventTarget = domEvent.target;

  /**
   * Manage emulated events and early bailout.
   * Since PointerEvent is not used yet (lack of support in older Safari), it's
   * necessary to manually manage the mess of browser touch/mouse events.
   * And bailout early for termination events when there is no active responder.
   */

  // Flag when browser may produce emulated events
  if (eventType === 'touchstart') {
    isEmulatingMouseEvents = true;
  }
  // Remove flag when browser will not produce emulated events
  if (eventType === 'touchmove' || trackedTouchCount > 1) {
    isEmulatingMouseEvents = false;
  }
  // Ignore various events in particular circumstances
  if (
    // Ignore browser emulated mouse events
    (eventType === 'mousedown' && isEmulatingMouseEvents) ||
    (eventType === 'mousemove' && isEmulatingMouseEvents) ||
    // Ignore mousemove if a mousedown didn't occur first
    (eventType === 'mousemove' && trackedTouchCount < 1)
  ) {
    return;
  }
  // Remove flag after emulated events are finished
  if (isEmulatingMouseEvents && eventType === 'mouseup') {
    if (trackedTouchCount === 0) {
      isEmulatingMouseEvents = false;
    }
    return;
  }

  const isStartEvent = isStartish(eventType) && isPrimaryPointerDown(domEvent);
  const isMoveEvent = isMoveish(eventType);
  const isEndEvent = isEndish(eventType);
  const isScrollEvent = isScroll(eventType);
  const isSelectionChangeEvent = isSelectionChange(eventType);
  const responderEvent = createResponderEvent(
    domEvent,
    responderTouchHistoryStore
  );

  /**
   * Record the state of active pointers
   */

  if (isStartEvent || isMoveEvent || isEndEvent) {
    if (domEvent.touches) {
      trackedTouchCount = domEvent.touches.length;
    } else {
      if (isStartEvent) {
        trackedTouchCount = 1;
      } else if (isEndEvent) {
        trackedTouchCount = 0;
      }
    }
    responderTouchHistoryStore.recordTouchTrack(
      eventType,
      responderEvent.nativeEvent
    );
  }

  /**
   * Responder System logic
   */

  let eventPaths = getResponderPaths(domEvent);
  let wasNegotiated = false;
  let wantsResponder;

  // If an event occured that might change the current responder...
  if (isStartEvent || isMoveEvent || (isScrollEvent && trackedTouchCount > 0)) {
    // If there is already a responder, prune the event paths to the lowest common ancestor
    // of the existing responder and deepest target of the event.
    const currentResponderIdPath = currentResponder.idPath;
    const eventIdPath = eventPaths.idPath;

    if (currentResponderIdPath != null && eventIdPath != null) {
      const lowestCommonAncestor = getLowestCommonAncestor(
        currentResponderIdPath,
        eventIdPath
      );
      if (lowestCommonAncestor != null) {
        const indexOfLowestCommonAncestor =
          eventIdPath.indexOf(lowestCommonAncestor);
        // Skip the current responder so it doesn't receive unexpected "shouldSet" events.
        const index =
          indexOfLowestCommonAncestor +
          (lowestCommonAncestor === currentResponder.id ? 1 : 0);
        eventPaths = {
          idPath: eventIdPath.slice(index),
          nodePath: eventPaths.nodePath.slice(index)
        };
      } else {
        eventPaths = null;
      }
    }

    if (eventPaths != null) {
      // If a node wants to become the responder, attempt to transfer.
      wantsResponder = findWantsResponder(eventPaths, domEvent, responderEvent);
      if (wantsResponder != null) {
        // Sets responder if none exists, or negotates with existing responder.
        attemptTransfer(responderEvent, wantsResponder);
        wasNegotiated = true;
      }
    }
  }

  // If there is now a responder, invoke its callbacks for the lifecycle of the gesture.
  if (currentResponder.id != null && currentResponder.node != null) {
    const { id, node } = currentResponder;
    const {
      onResponderStart,
      onResponderMove,
      onResponderEnd,
      onResponderRelease,
      onResponderTerminate,
      onResponderTerminationRequest
    } = getResponderConfig(id);

    responderEvent.bubbles = false;
    responderEvent.cancelable = false;
    responderEvent.currentTarget = node;

    // Start
    if (isStartEvent) {
      if (onResponderStart != null) {
        responderEvent.dispatchConfig.registrationName = 'onResponderStart';
        onResponderStart(responderEvent);
      }
    }
    // Move
    else if (isMoveEvent) {
      if (onResponderMove != null) {
        responderEvent.dispatchConfig.registrationName = 'onResponderMove';
        onResponderMove(responderEvent);
      }
    } else {
      const isTerminateEvent =
        isCancelish(eventType) ||
        // native context menu
        eventType === 'contextmenu' ||
        // window blur
        (eventType === 'blur' && eventTarget === window) ||
        // responder (or ancestors) blur
        (eventType === 'blur' &&
          eventTarget.contains(node) &&
          domEvent.relatedTarget !== node) ||
        // native scroll without using a pointer
        (isScrollEvent && trackedTouchCount === 0) ||
        // native scroll on node that is parent of the responder (allow siblings to scroll)
        (isScrollEvent && eventTarget.contains(node) && eventTarget !== node) ||
        // native select/selectionchange on node
        (isSelectionChangeEvent && hasValidSelection(domEvent));

      const isReleaseEvent =
        isEndEvent &&
        !isTerminateEvent &&
        !hasTargetTouches(node, domEvent.touches);

      // End
      if (isEndEvent) {
        if (onResponderEnd != null) {
          responderEvent.dispatchConfig.registrationName = 'onResponderEnd';
          onResponderEnd(responderEvent);
        }
      }
      // Release
      if (isReleaseEvent) {
        if (onResponderRelease != null) {
          responderEvent.dispatchConfig.registrationName = 'onResponderRelease';
          onResponderRelease(responderEvent);
        }
        changeCurrentResponder(emptyResponder);
      }
      // Terminate
      if (isTerminateEvent) {
        let shouldTerminate = true;

        // Responders can still avoid termination but only for these events.
        if (
          eventType === 'contextmenu' ||
          eventType === 'scroll' ||
          eventType === 'selectionchange'
        ) {
          // Only call this function is it wasn't already called during negotiation.
          if (wasNegotiated) {
            shouldTerminate = false;
          } else if (onResponderTerminationRequest != null) {
            responderEvent.dispatchConfig.registrationName =
              'onResponderTerminationRequest';
            if (onResponderTerminationRequest(responderEvent) === false) {
              shouldTerminate = false;
            }
          }
        }

        if (shouldTerminate) {
          if (onResponderTerminate != null) {
            responderEvent.dispatchConfig.registrationName =
              'onResponderTerminate';
            onResponderTerminate(responderEvent);
          }
          changeCurrentResponder(emptyResponder);
          isEmulatingMouseEvents = false;
          trackedTouchCount = 0;
        }
      }
    }
  }
}

/**
 * Walk the event path to/from the target node. At each node, stop and call the
 * relevant "shouldSet" functions for the given event type. If any of those functions
 * call "stopPropagation" on the event, stop searching for a responder.
 */
function findWantsResponder(eventPaths, domEvent, responderEvent) {
  const shouldSetCallbacks = shouldSetResponderEvents[(domEvent.type: any)]; // for Flow

  if (shouldSetCallbacks != null) {
    const { idPath, nodePath } = eventPaths;

    const shouldSetCallbackCaptureName = shouldSetCallbacks[0];
    const shouldSetCallbackBubbleName = shouldSetCallbacks[1];
    const { bubbles } = shouldSetCallbacks[2];

    const check = function (id, node, callbackName) {
      const config = getResponderConfig(id);
      const shouldSetCallback = config[callbackName];
      if (shouldSetCallback != null) {
        responderEvent.currentTarget = node;
        if (shouldSetCallback(responderEvent) === true) {
          // Start the path from the potential responder
          const prunedIdPath = idPath.slice(idPath.indexOf(id));
          return { id, node, idPath: prunedIdPath };
        }
      }
    };

    // capture
    for (let i = idPath.length - 1; i >= 0; i--) {
      const id = idPath[i];
      const node = nodePath[i];
      const result = check(id, node, shouldSetCallbackCaptureName);
      if (result != null) {
        return result;
      }
      if (responderEvent.isPropagationStopped() === true) {
        return;
      }
    }

    // bubble
    if (bubbles) {
      for (let i = 0; i < idPath.length; i++) {
        const id = idPath[i];
        const node = nodePath[i];
        const result = check(id, node, shouldSetCallbackBubbleName);
        if (result != null) {
          return result;
        }
        if (responderEvent.isPropagationStopped() === true) {
          return;
        }
      }
    } else {
      const id = idPath[0];
      const node = nodePath[0];
      const target = domEvent.target;
      if (target === node) {
        return check(id, node, shouldSetCallbackBubbleName);
      }
    }
  }
}

/**
 * Attempt to transfer the responder.
 */
function attemptTransfer(
  responderEvent: ResponderEvent,
  wantsResponder: ActiveResponderInstance
) {
  const { id: currentId, node: currentNode } = currentResponder;
  const { id, node } = wantsResponder;

  const { onResponderGrant, onResponderReject } = getResponderConfig(id);

  responderEvent.bubbles = false;
  responderEvent.cancelable = false;
  responderEvent.currentTarget = node;

  // Set responder
  if (currentId == null) {
    if (onResponderGrant != null) {
      responderEvent.currentTarget = node;
      responderEvent.dispatchConfig.registrationName = 'onResponderGrant';
      onResponderGrant(responderEvent);
    }
    changeCurrentResponder(wantsResponder);
  }
  // Negotiate with current responder
  else {
    const { onResponderTerminate, onResponderTerminationRequest } =
      getResponderConfig(currentId);

    let allowTransfer = true;
    if (onResponderTerminationRequest != null) {
      responderEvent.currentTarget = currentNode;
      responderEvent.dispatchConfig.registrationName =
        'onResponderTerminationRequest';
      if (onResponderTerminationRequest(responderEvent) === false) {
        allowTransfer = false;
      }
    }

    if (allowTransfer) {
      // Terminate existing responder
      if (onResponderTerminate != null) {
        responderEvent.currentTarget = currentNode;
        responderEvent.dispatchConfig.registrationName = 'onResponderTerminate';
        onResponderTerminate(responderEvent);
      }
      // Grant next responder
      if (onResponderGrant != null) {
        responderEvent.currentTarget = node;
        responderEvent.dispatchConfig.registrationName = 'onResponderGrant';
        onResponderGrant(responderEvent);
      }
      changeCurrentResponder(wantsResponder);
    } else {
      // Reject responder request
      if (onResponderReject != null) {
        responderEvent.currentTarget = node;
        responderEvent.dispatchConfig.registrationName = 'onResponderReject';
        onResponderReject(responderEvent);
      }
    }
  }
}

/* ------------ PUBLIC API ------------ */

/**
 * Attach Listeners
 *
 * Use native events as ReactDOM doesn't have a non-plugin API to implement
 * this system.
 */
const documentEventsCapturePhase = ['blur', 'scroll'];
const documentEventsBubblePhase = [
  // mouse
  'mousedown',
  'mousemove',
  'mouseup',
  'dragstart',
  // touch
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  // other
  'contextmenu',
  'select',
  'selectionchange'
];
export function attachListeners() {
  if (canUseDOM && window.__reactResponderSystemActive == null) {
    window.addEventListener('blur', eventListener);
    documentEventsBubblePhase.forEach((eventType) => {
      document.addEventListener(eventType, eventListener);
    });
    documentEventsCapturePhase.forEach((eventType) => {
      document.addEventListener(eventType, eventListener, true);
    });
    window.__reactResponderSystemActive = true;
  }
}

/**
 * Register a node with the ResponderSystem.
 */
export function addNode(id: ResponderId, node: any, config: ResponderConfig) {
  setResponderId(node, id);
  responderListenersMap.set(id, config);
}

/**
 * Unregister a node with the ResponderSystem.
 */
export function removeNode(id: ResponderId) {
  if (currentResponder.id === id) {
    terminateResponder();
  }
  if (responderListenersMap.has(id)) {
    responderListenersMap.delete(id);
  }
}

/**
 * Allow the current responder to be terminated from within components to support
 * more complex requirements, such as use with other React libraries for working
 * with scroll views, input views, etc.
 */
export function terminateResponder() {
  const { id, node } = currentResponder;
  if (id != null && node != null) {
    const { onResponderTerminate } = getResponderConfig(id);
    if (onResponderTerminate != null) {
      const event = createResponderEvent({}, responderTouchHistoryStore);
      event.currentTarget = node;
      onResponderTerminate(event);
    }
    changeCurrentResponder(emptyResponder);
  }
  isEmulatingMouseEvents = false;
  trackedTouchCount = 0;
}

/**
 * Allow unit tests to inspect the current responder in the system.
 * FOR TESTING ONLY.
 */
export function getResponderNode(): any {
  return currentResponder.node;
}
