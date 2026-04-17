/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import createEvent from './createEvent';
import {
  buttonType,
  buttonsType,
  defaultPointerSize,
  defaultBrowserChromeSize
} from './constants';

/**
 * Native event object mocks for higher-level events.
 *
 * 1. Each event type defines the exact object that it accepts. This ensures
 * that no arbitrary properties can be assigned to events, and the properties
 * that don't exist on specific event types (e.g., 'pointerType') are not added
 * to the respective native event.
 *
 * 2. Properties that cannot be relied on due to inconsistent browser support (e.g., 'x' and 'y') are not
 * added to the native event. Others that shouldn't be arbitrarily customized (e.g., 'screenX')
 * are automatically inferred from associated values.
 *
 * 3. PointerEvent and TouchEvent fields are normalized (e.g., 'rotationAngle' -> 'twist')
 */

function emptyFunction() {}

function createGetModifierState(keyArg, data) {
  if (keyArg === 'Alt') {
    return data.altKey || false;
  }
  if (keyArg === 'Control') {
    return data.ctrlKey || false;
  }
  if (keyArg === 'Meta') {
    return data.metaKey || false;
  }
  if (keyArg === 'Shift') {
    return data.shiftKey || false;
  }
}

/**
 * KeyboardEvent
 */

function createKeyboardEvent(
  type,
  {
    altKey = false,
    ctrlKey = false,
    isComposing = false,
    key = '',
    metaKey = false,
    preventDefault = emptyFunction,
    shiftKey = false
  } = {}
) {
  const modifierState = { altKey, ctrlKey, metaKey, shiftKey };

  const eventPayload = {
    altKey,
    ctrlKey,
    getModifierState(keyArg) {
      return createGetModifierState(keyArg, modifierState);
    },
    isComposing,
    key,
    metaKey,
    preventDefault,
    shiftKey
  };

  if (isComposing) {
    eventPayload.keyCode = 229;
  }

  return createEvent(type, eventPayload);
}

/**
 * MouseEvent
 */

function createMouseEvent(
  type,
  {
    altKey = false,
    button = buttonType.none,
    buttons = buttonsType.none,
    ctrlKey = false,
    detail = 1,
    metaKey = false,
    movementX = 0,
    movementY = 0,
    offsetX = 0,
    offsetY = 0,
    pageX,
    pageY,
    preventDefault = emptyFunction,
    relatedTarget,
    screenX,
    screenY,
    shiftKey = false,
    timeStamp,
    x = 0,
    y = 0
  } = {}
) {
  const modifierState = { altKey, ctrlKey, metaKey, shiftKey };

  return createEvent(type, {
    altKey,
    button,
    buttons,
    clientX: x,
    clientY: y,
    ctrlKey,
    detail,
    getModifierState(keyArg) {
      return createGetModifierState(keyArg, modifierState);
    },
    metaKey,
    movementX,
    movementY,
    offsetX,
    offsetY,
    pageX: pageX || x,
    pageY: pageY || y,
    preventDefault,
    relatedTarget,
    screenX: screenX === 0 ? screenX : x,
    screenY: screenY === 0 ? screenY : y + defaultBrowserChromeSize,
    shiftKey,
    timeStamp
  });
}

/**
 * PointerEvent
 */

function createPointerEvent(
  type,
  {
    altKey = false,
    button = buttonType.none,
    buttons = buttonsType.none,
    ctrlKey = false,
    detail = 1,
    height,
    metaKey = false,
    movementX = 0,
    movementY = 0,
    offsetX = 0,
    offsetY = 0,
    pageX,
    pageY,
    pointerId,
    pressure = 0,
    preventDefault = emptyFunction,
    pointerType = 'mouse',
    relatedTarget,
    screenX,
    screenY,
    shiftKey = false,
    tangentialPressure = 0,
    tiltX = 0,
    tiltY = 0,
    timeStamp,
    twist = 0,
    width,
    x = 0,
    y = 0
  } = {}
) {
  const modifierState = { altKey, ctrlKey, metaKey, shiftKey };
  const isMouse = pointerType === 'mouse';

  return createEvent(type, {
    altKey,
    button,
    buttons,
    clientX: x,
    clientY: y,
    ctrlKey,
    detail,
    getModifierState(keyArg) {
      return createGetModifierState(keyArg, modifierState);
    },
    height: isMouse ? 1 : height != null ? height : defaultPointerSize,
    metaKey,
    movementX,
    movementY,
    offsetX,
    offsetY,
    pageX: pageX || x,
    pageY: pageY || y,
    pointerId,
    pointerType,
    pressure,
    preventDefault,
    relatedTarget,
    releasePointerCapture: emptyFunction,
    screenX: screenX === 0 ? screenX : x,
    screenY: screenY === 0 ? screenY : y + defaultBrowserChromeSize,
    setPointerCapture: emptyFunction,
    shiftKey,
    tangentialPressure,
    tiltX,
    tiltY,
    timeStamp,
    twist,
    width: isMouse ? 1 : width != null ? width : defaultPointerSize
  });
}

/**
 * TouchEvent
 */

function createTouchEvent(type, payload) {
  return createEvent(type, {
    ...payload,
    detail: 0,
    sourceCapabilities: {
      firesTouchEvents: true
    }
  });
}

/**
 * DOM events
 */

export function blur({ relatedTarget } = {}) {
  return createEvent('blur', { relatedTarget });
}

export function click(payload) {
  return createMouseEvent('click', {
    button: buttonType.primary,
    ...payload
  });
}

export function contextmenu(payload) {
  return createMouseEvent('contextmenu', {
    ...payload,
    detail: 0
  });
}

export function dragstart(payload) {
  return createMouseEvent('dragstart', {
    ...payload,
    detail: 0
  });
}

export function error() {
  return createEvent('error');
}

export function focus({ relatedTarget } = {}) {
  return createEvent('focus', { relatedTarget });
}

export function focusin({ relatedTarget } = {}) {
  return createEvent('focusin', { relatedTarget });
}

export function focusout({ relatedTarget } = {}) {
  return createEvent('focusout', { relatedTarget });
}

export function gotpointercapture(payload) {
  return createPointerEvent('gotpointercapture', payload);
}

export function keydown(payload) {
  return createKeyboardEvent('keydown', payload);
}

export function keyup(payload) {
  return createKeyboardEvent('keyup', payload);
}

export function load(payload) {
  return createEvent('load', payload);
}

export function lostpointercapture(payload) {
  return createPointerEvent('lostpointercapture', payload);
}

export function mousedown(payload) {
  // The value of 'button' and 'buttons' for 'mousedown' must not be none.
  const button =
    payload != null && payload.button !== buttonType.none
      ? payload.button
      : buttonType.primary;
  const buttons =
    payload != null && payload.buttons !== buttonsType.none
      ? payload.buttons
      : buttonsType.primary;

  return createMouseEvent('mousedown', {
    ...payload,
    button,
    buttons
  });
}

export function mouseenter(payload) {
  return createMouseEvent('mouseenter', payload);
}

export function mouseleave(payload) {
  return createMouseEvent('mouseleave', payload);
}

export function mousemove(payload) {
  return createMouseEvent('mousemove', {
    // 0 is also the uninitialized value (i.e., don't assume it means primary button down)
    button: 0,
    buttons: 0,
    ...payload
  });
}

export function mouseout(payload) {
  return createMouseEvent('mouseout', payload);
}

export function mouseover(payload) {
  return createMouseEvent('mouseover', payload);
}

export function mouseup(payload) {
  return createMouseEvent('mouseup', {
    button: buttonType.primary,
    ...payload,
    buttons: buttonsType.none
  });
}
export function pointercancel(payload) {
  return createPointerEvent('pointercancel', {
    ...payload,
    buttons: 0,
    detail: 0,
    height: 1,
    pageX: 0,
    pageY: 0,
    pressure: 0,
    screenX: 0,
    screenY: 0,
    width: 1,
    x: 0,
    y: 0
  });
}

export function pointerdown(payload) {
  const isTouch = payload != null && payload.pointerType === 'touch';
  return createPointerEvent('pointerdown', {
    button: buttonType.primary,
    buttons: buttonsType.primary,
    pressure: isTouch ? 1 : 0.5,
    ...payload
  });
}

export function pointerenter(payload) {
  return createPointerEvent('pointerenter', payload);
}

export function pointerleave(payload) {
  return createPointerEvent('pointerleave', payload);
}

export function pointermove(payload) {
  return createPointerEvent('pointermove', {
    ...payload,
    button: buttonType.none,
    buttons: buttonsType.none
  });
}

export function pointerout(payload) {
  return createPointerEvent('pointerout', payload);
}

export function pointerover(payload) {
  return createPointerEvent('pointerover', payload);
}

export function pointerup(payload) {
  return createPointerEvent('pointerup', {
    button: buttonType.primary,
    ...payload,
    buttons: buttonsType.none,
    pressure: 0
  });
}

export function scroll() {
  return createEvent('scroll', { bubbles: false });
}

export function select() {
  return createEvent('select');
}

export function selectionchange() {
  return createEvent('selectionchange');
}

export function touchcancel(payload) {
  return createTouchEvent('touchcancel', payload);
}

export function touchend(payload) {
  return createTouchEvent('touchend', payload);
}

export function touchmove(payload) {
  return createTouchEvent('touchmove', payload);
}

export function touchstart(payload) {
  return createTouchEvent('touchstart', payload);
}

export function virtualclick(payload) {
  return createMouseEvent('click', {
    button: 0,
    ...payload,
    buttons: 0,
    detail: 0,
    height: 1,
    pageX: 0,
    pageY: 0,
    pressure: 0,
    screenX: 0,
    screenY: 0,
    width: 1,
    x: 0,
    y: 0
  });
}
