/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const defaultConfig = {
  constructorType: 'Event',
  defaultInit: { bubbles: true, cancelable: true, composed: true }
};

const eventConfigs = {
  blur: {
    constructorType: 'FocusEvent',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  change: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: false }
  },
  click: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  compositionend: {
    constructorType: 'CompositionEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  compositionstart: {
    constructorType: 'CompositionEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  compositionupdate: {
    constructorType: 'CompositionEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  contextmenu: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  dblclick: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  drag: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  dragend: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  dragenter: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  dragexit: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  dragleave: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  dragover: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  dragstart: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  drop: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  error: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: false }
  },
  focus: {
    constructorType: 'FocusEvent',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  focusin: {
    constructorType: 'FocusEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  focusout: {
    constructorType: 'FocusEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  input: {
    constructorType: 'InputEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  invalid: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: true }
  },
  keydown: {
    constructorType: 'KeyboardEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  keyup: {
    constructorType: 'KeyboardEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  load: {
    constructorType: 'UIEvent',
    defaultInit: { bubbles: false, cancelable: false }
  },
  mousedown: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  mouseenter: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  mouseleave: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  mousemove: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  mouseout: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  mouseover: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  mouseup: {
    constructorType: 'MouseEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  scroll: {
    constructorType: 'UIEvent',
    defaultInit: { bubbles: false, cancelable: false }
  },
  select: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: false }
  },
  submit: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true }
  },
  touchcancel: {
    constructorType: 'TouchEvent',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  touchend: {
    constructorType: 'TouchEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  touchmove: {
    constructorType: 'TouchEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  touchstart: {
    constructorType: 'TouchEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  // 'PointerEvent' constructor is not supported in jsdom
  gotpointercapture: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  lostpointercapture: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: false, composed: true }
  },
  pointercancel: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: false, composed: true }
  },
  pointerdown: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  pointerenter: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: false }
  },
  pointerleave: {
    constructorType: 'Event',
    defaultInit: { bubbles: false, cancelable: false }
  },
  pointermove: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  pointerout: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  pointerover: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  pointerup: {
    constructorType: 'Event',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  },
  wheel: {
    constructorType: 'WheelEvent',
    defaultInit: { bubbles: true, cancelable: true, composed: true }
  }
};

function getEventConfig(type) {
  return eventConfigs[type] || defaultConfig;
}

export default function createEvent(type, init) {
  const config = getEventConfig(type);
  const { constructorType, defaultInit } = config;
  const eventInit = { ...defaultInit, ...init };

  const event = document.createEvent(constructorType);
  const { bubbles, cancelable, ...data } = eventInit;
  event.initEvent(type, bubbles, cancelable);

  if (data != null) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      // Ensure that mocks for 'preventDefault' can be called without interferring with
      // the native behavior of 'preventDefault' (inc for passive events)
      if (key === 'preventDefault' && typeof value === 'function') {
        const originalPreventDefault = event.preventDefault.bind(event);
        const preventDefault = function () {
          // call the original function
          originalPreventDefault();
          // call the mock function
          value();
        };
        Object.defineProperty(event, key, {
          configurable: true,
          value: preventDefault
        });
      } else if (value != null) {
        Object.defineProperty(event, key, { configurable: true, value });
      }
    });
  }
  return event;
}
