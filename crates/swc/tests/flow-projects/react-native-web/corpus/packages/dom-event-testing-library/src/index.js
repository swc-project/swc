/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { buttonType, buttonsType } from './constants';
import * as domEvents from './domEvents';
import * as domEventSequences from './domEventSequences';
import { hasPointerEvent, setPointerEvent, platform } from './domEnvironment';
import { describeWithPointerEvent, testWithPointerType } from './testHelpers';

const createEventTarget = (node) => ({
  node,
  /**
   * Simple events abstraction.
   */
  blur(payload) {
    node.dispatchEvent(domEvents.blur(payload));
  },
  click(payload) {
    node.dispatchEvent(domEvents.click(payload));
  },
  contextmenu(payload) {
    domEventSequences.contextmenu(node, payload);
  },
  error() {
    node.dispatchEvent(domEvents.error());
  },
  focus(payload) {
    domEventSequences.focus(node, payload);
  },
  keydown(payload) {
    node.dispatchEvent(domEvents.keydown(payload));
  },
  keyup(payload) {
    node.dispatchEvent(domEvents.keyup(payload));
  },
  load(payload) {
    node.dispatchEvent(domEvents.load(payload));
  },
  /**
   * PointerEvent abstraction.
   * Dispatches the expected sequence of PointerEvents, MouseEvents, and
   * TouchEvents for a given environment.
   */
  // node no longer receives events for the pointer
  pointercancel(payload) {
    domEventSequences.pointercancel(node, payload);
  },
  // node dispatches down events
  pointerdown(payload) {
    domEventSequences.pointerdown(node, payload);
  },
  // node dispatches move events (pointer is not down)
  pointerhover(payload) {
    domEventSequences.pointerhover(node, payload);
  },
  // node dispatches move events (pointer is down)
  pointermove(payload) {
    domEventSequences.pointermove(node, payload);
  },
  // node dispatches enter & over events
  pointerover(payload) {
    domEventSequences.pointerover(node, payload);
  },
  // node dispatches exit & leave events
  pointerout(payload) {
    domEventSequences.pointerout(node, payload);
  },
  // node dispatches up events
  pointerup(payload) {
    domEventSequences.pointerup(node, payload);
  },
  scroll(payload) {
    node.dispatchEvent(domEvents.scroll(payload));
  },
  select(payload) {
    node.dispatchEvent(domEvents.select(payload));
  },
  // selectionchange is only dispatched on 'document'
  selectionchange(payload) {
    document.dispatchEvent(domEvents.selectionchange(payload));
  },
  /**
   * Gesture abstractions.
   * Helpers for event sequences expected in a gesture.
   * target.tap({ pointerType: 'touch' })
   */
  tap(payload) {
    domEventSequences.pointerdown(payload);
    domEventSequences.pointerup(payload);
  },
  virtualclick(payload) {
    node.dispatchEvent(domEvents.virtualclick(payload));
  },
  /**
   * Utilities
   */
  setBoundingClientRect({ x, y, width, height }) {
    node.getBoundingClientRect = function () {
      return {
        width,
        height,
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
        x,
        y
      };
    };
  }
});

const clearPointers = domEventSequences.clearPointers;

export {
  buttonType,
  buttonsType,
  clearPointers,
  createEventTarget,
  describeWithPointerEvent,
  platform,
  hasPointerEvent,
  setPointerEvent,
  testWithPointerType
};
