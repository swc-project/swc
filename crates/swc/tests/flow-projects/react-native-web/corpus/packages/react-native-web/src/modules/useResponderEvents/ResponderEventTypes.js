/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Touch = {
  force: number,
  identifier: number,
  // The locationX and locationY properties are non-standard additions
  locationX: any,
  locationY: any,
  pageX: number,
  pageY: number,
  target: any,
  // Touches in a list have a timestamp property
  timestamp: number
};

export type TouchEvent = {
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
  shiftKey: boolean,
  // TouchList is an array in the Responder system
  changedTouches: Array<Touch>,
  force: number,
  // React Native adds properties to the "nativeEvent that are usually only found on W3C Touches ‾\_(ツ)_/‾
  identifier: number,
  locationX: any,
  locationY: any,
  pageX: number,
  pageY: number,
  target: any,
  // The timestamp has a lowercase "s" in the Responder system
  timestamp: number,
  // TouchList is an array in the Responder system
  touches: Array<Touch>
};

export const BLUR = 'blur';
export const CONTEXT_MENU = 'contextmenu';
export const FOCUS_OUT = 'focusout';
export const MOUSE_DOWN = 'mousedown';
export const MOUSE_MOVE = 'mousemove';
export const MOUSE_UP = 'mouseup';
export const MOUSE_CANCEL = 'dragstart';
export const TOUCH_START = 'touchstart';
export const TOUCH_MOVE = 'touchmove';
export const TOUCH_END = 'touchend';
export const TOUCH_CANCEL = 'touchcancel';
export const SCROLL = 'scroll';
export const SELECT = 'select';
export const SELECTION_CHANGE = 'selectionchange';

export function isStartish(eventType: mixed): boolean {
  return eventType === TOUCH_START || eventType === MOUSE_DOWN;
}

export function isMoveish(eventType: mixed): boolean {
  return eventType === TOUCH_MOVE || eventType === MOUSE_MOVE;
}

export function isEndish(eventType: mixed): boolean {
  return (
    eventType === TOUCH_END || eventType === MOUSE_UP || isCancelish(eventType)
  );
}

export function isCancelish(eventType: mixed): boolean {
  return eventType === TOUCH_CANCEL || eventType === MOUSE_CANCEL;
}

export function isScroll(eventType: mixed): boolean {
  return eventType === SCROLL;
}

export function isSelectionChange(eventType: mixed): boolean {
  return eventType === SELECT || eventType === SELECTION_CHANGE;
}
