/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import {
  buttonType,
  buttonsType,
  defaultPointerId,
  defaultPointerSize,
  defaultBrowserChromeSize
} from './constants';
import * as domEvents from './domEvents';
import { hasPointerEvent, platform } from './domEnvironment';
import * as touchStore from './touchStore';

/**
 * Converts a PointerEvent payload to a Touch
 */
function createTouch(target, payload) {
  const {
    height = defaultPointerSize,
    pageX,
    pageY,
    pointerId,
    pressure = 1,
    twist = 0,
    width = defaultPointerSize,
    x = 0,
    y = 0
  } = payload;

  return {
    clientX: x,
    clientY: y,
    force: pressure,
    identifier: pointerId,
    pageX: pageX || x,
    pageY: pageY || y,
    radiusX: width / 2,
    radiusY: height / 2,
    rotationAngle: twist,
    target,
    screenX: x,
    screenY: y + defaultBrowserChromeSize
  };
}

/**
 * Converts a PointerEvent to a TouchEvent
 */
function createTouchEventPayload(target, touch, payload) {
  const {
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    preventDefault,
    shiftKey = false,
    timeStamp
  } = payload;

  return {
    altKey,
    changedTouches: [touch],
    ctrlKey,
    metaKey,
    preventDefault,
    shiftKey,
    targetTouches: touchStore.getTargetTouches(target),
    timeStamp,
    touches: touchStore.getTouches()
  };
}

function getPointerType(payload) {
  let pointerType = 'mouse';
  if (payload != null && payload.pointerType != null) {
    pointerType = payload.pointerType;
  }
  return pointerType;
}

/**
 * Pointer events sequences.
 *
 * Creates representative browser event sequences for high-level gestures based on pointers.
 * This allows unit tests to be written in terms of simple pointer interactions while testing
 * that the responses to those interactions account for the complex sequence of events that
 * browsers produce as a result.
 *
 * Every time a new pointer touches the surface a 'touchstart' event should be dispatched.
 * - 'changedTouches' contains the new touch.
 * - 'targetTouches' contains all the active pointers for the target.
 * - 'touches' contains all the active pointers on the surface.
 *
 * Every time an existing pointer moves a 'touchmove' event should be dispatched.
 * - 'changedTouches' contains the updated touch.
 *
 * Every time an existing pointer leaves the surface a 'touchend' event should be dispatched.
 * - 'changedTouches' contains the released touch.
 * - 'targetTouches' contains any of the remaining active pointers for the target.
 */

export function contextmenu(target, defaultPayload = {}) {
  const dispatch = (arg) => target.dispatchEvent(arg);
  const pointerType = getPointerType(defaultPayload);

  const {
    ctrlKey,
    // eslint-disable-next-line
    pointerType: _,
    ...restPayload
  } = defaultPayload;

  const payload = {
    pointerId: defaultPointerId,
    ...restPayload,
    button: buttonType.primary,
    buttons: buttonsType.primary,
    pointerType
  };

  const preventDefault = payload.preventDefault;

  if (pointerType === 'touch') {
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerdown(payload));
    }
    const touch = createTouch(target, payload);
    touchStore.addTouch(touch);
    const touchEventPayload = createTouchEventPayload(target, touch, payload);
    dispatch(domEvents.touchstart(touchEventPayload));
    dispatch(
      domEvents.mousemove({
        ...payload,
        button: buttonType.primary,
        buttons: buttonsType.none
      })
    );
    dispatch(
      domEvents.contextmenu({
        ...payload,
        button: buttonType.primary,
        buttons: buttonsType.none,
        preventDefault
      })
    );
    touchStore.removeTouch(touch);
  } else if (pointerType === 'mouse') {
    if (ctrlKey === true) {
      const { button, buttons } = payload;
      if (hasPointerEvent()) {
        dispatch(domEvents.pointerdown({ ...payload, ctrlKey }));
      }
      dispatch(domEvents.mousedown({ ...payload, ctrlKey }));
      if (platform.get() === 'mac') {
        dispatch(
          domEvents.contextmenu({ button, buttons, ctrlKey, preventDefault })
        );
      }
    } else {
      const button = buttonType.secondary;
      const buttons = buttonsType.secondary;
      if (hasPointerEvent()) {
        dispatch(domEvents.pointerdown({ ...payload, button, buttons }));
      }
      dispatch(domEvents.mousedown({ ...payload, button, buttons }));
      dispatch(
        domEvents.contextmenu({ ...payload, button, buttons, preventDefault })
      );
    }
  }
}

export function focus(target, defaultPayload = {}) {
  const dispatch = (arg) => target.dispatchEvent(arg);
  const { relatedTarget, ...payload } = defaultPayload;
  const blurPayload = { ...payload, relatedTarget: target };
  const focusPayload = { ...payload, relatedTarget };
  if (relatedTarget) {
    relatedTarget.dispatchEvent(domEvents.focusout(blurPayload));
  }
  dispatch(domEvents.focusin(focusPayload));
  if (relatedTarget) {
    relatedTarget.dispatchEvent(domEvents.blur(blurPayload));
  }
  dispatch(domEvents.focus(focusPayload));
}

export function pointercancel(target, defaultPayload) {
  const dispatchEvent = (arg) => target.dispatchEvent(arg);
  const pointerType = getPointerType(defaultPayload);

  const payload = {
    pointerId: defaultPointerId,
    pointerType,
    ...defaultPayload
  };

  if (hasPointerEvent()) {
    dispatchEvent(domEvents.pointercancel(payload));
  }
  if (pointerType === 'mouse') {
    dispatchEvent(domEvents.dragstart(payload));
  } else {
    const touch = createTouch(target, payload);
    touchStore.removeTouch(touch);
    const touchEventPayload = createTouchEventPayload(target, touch, payload);
    dispatchEvent(domEvents.touchcancel(touchEventPayload));
  }
}

export function pointerdown(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);
  const pointerType = getPointerType(defaultPayload);

  const payload = {
    button: buttonType.primary,
    buttons: buttonsType.primary,
    pointerId: defaultPointerId,
    pointerType,
    ...defaultPayload
  };

  if (pointerType === 'mouse') {
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerover(payload));
      dispatch(domEvents.pointerenter(payload));
    }
    dispatch(domEvents.mouseover(payload));
    dispatch(domEvents.mouseenter(payload));
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerdown(payload));
    }
    dispatch(domEvents.mousedown(payload));
    focus(target);
  } else {
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerover(payload));
      dispatch(domEvents.pointerenter(payload));
      dispatch(domEvents.pointerdown(payload));
    }
    const touch = createTouch(target, payload);
    touchStore.addTouch(touch);
    const touchEventPayload = createTouchEventPayload(target, touch, payload);
    dispatch(domEvents.touchstart(touchEventPayload));
    if (hasPointerEvent()) {
      dispatch(domEvents.gotpointercapture(payload));
    }
  }
}

export function pointerover(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);

  const payload = {
    pointerId: defaultPointerId,
    ...defaultPayload
  };

  if (hasPointerEvent()) {
    // Pointer must move before it can dispatch "over"
    dispatch(domEvents.pointermove());
    dispatch(domEvents.pointerover(payload));
    dispatch(domEvents.pointerenter(payload));
  }
  dispatch(domEvents.mousemove());
  dispatch(domEvents.mouseover(payload));
  dispatch(domEvents.mouseenter(payload));
}

export function pointerout(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);

  const payload = {
    pointerId: defaultPointerId,
    ...defaultPayload
  };

  const { relatedTarget } = payload;

  if (hasPointerEvent()) {
    dispatch(domEvents.pointerout(payload));
    // Only call the leave event if exiting the subtree
    if (!target.contains(relatedTarget)) {
      dispatch(domEvents.pointerleave(payload));
    }
  }
  dispatch(domEvents.mouseout(payload));
  if (!target.contains(relatedTarget)) {
    // Only call the leave event if exiting the subtree
    dispatch(domEvents.mouseleave(payload));
  }
}

// pointer is not down while moving
export function pointerhover(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);

  const payload = {
    pointerId: defaultPointerId,
    ...defaultPayload
  };

  if (hasPointerEvent()) {
    dispatch(domEvents.pointermove(payload));
  }
  dispatch(domEvents.mousemove(payload));
}

// pointer is down while moving
export function pointermove(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);
  const pointerType = getPointerType(defaultPayload);

  const payload = {
    button: buttonType.primary,
    buttons: buttonsType.primary,
    pointerId: defaultPointerId,
    pointerType,
    ...defaultPayload
  };

  if (pointerType === 'mouse') {
    if (hasPointerEvent()) {
      dispatch(
        domEvents.pointermove({ pressure: 0.5, button: -1, ...payload })
      );
    }
    dispatch(domEvents.mousemove(payload));
  } else {
    if (hasPointerEvent()) {
      dispatch(
        domEvents.pointermove({
          pressure: 1,
          button: -1,
          ...payload
        })
      );
    }
    const touch = createTouch(target, payload);
    touchStore.updateTouch(touch);
    const touchEventPayload = createTouchEventPayload(target, touch, payload);
    dispatch(domEvents.touchmove(touchEventPayload));
  }
}

export function pointerup(target, defaultPayload) {
  const dispatch = (arg) => target.dispatchEvent(arg);
  const pointerType = getPointerType(defaultPayload);

  const payload = {
    pointerId: defaultPointerId,
    pointerType,
    ...defaultPayload
  };

  const isPrimaryButton = payload.button === buttonType.primary;
  const isContextMenuAction =
    platform.get() === 'mac' && payload.ctrlKey === true;

  if (pointerType === 'mouse') {
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerup(payload));
    }
    dispatch(domEvents.mouseup(payload));
    if (isPrimaryButton && !isContextMenuAction) {
      dispatch(domEvents.click(payload));
    }
  } else {
    if (hasPointerEvent()) {
      dispatch(domEvents.pointerup(payload));
      dispatch(domEvents.lostpointercapture(payload));
      dispatch(domEvents.pointerout(payload));
      dispatch(domEvents.pointerleave(payload));
    }
    const touch = createTouch(target, payload);
    const isGesture = touchStore.removeTouch(touch);
    const touchEventPayload = createTouchEventPayload(target, touch, payload);
    dispatch(domEvents.touchend(touchEventPayload));
    // emulated mouse events don't occur for multi-touch or after 'touchmove'
    if (!isGesture) {
      dispatch(domEvents.mouseover(payload));
      dispatch(domEvents.mousemove(payload));
      dispatch(domEvents.mousedown(payload));
    }
    focus(target);
    if (!isGesture) {
      dispatch(domEvents.mouseup(payload));
    }
    if (isPrimaryButton && !isContextMenuAction) {
      dispatch(domEvents.click(payload));
    }
  }
}

/**
 * This function should be called after each test to ensure the touchStore is cleared
 * in cases where the mock pointers weren't released before the test completed
 * (e.g., a test failed or ran a partial gesture).
 */
export function clearPointers() {
  touchStore.clear();
}
