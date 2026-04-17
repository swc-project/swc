/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

type ClickEvent = any;
type KeyboardEvent = any;
type ResponderEvent = any;

export type PressResponderConfig = $ReadOnly<{|
  // The gesture can be interrupted by a parent gesture, e.g., scroll.
  // Defaults to true.
  cancelable?: ?boolean,
  // Whether to disable initialization of the press gesture.
  disabled?: ?boolean,
  // Duration (in addition to `delayPressStart`) after which a press gesture is
  // considered a long press gesture. Defaults to 500 (milliseconds).
  delayLongPress?: ?number,
  // Duration to wait after press down before calling `onPressStart`.
  delayPressStart?: ?number,
  // Duration to wait after letting up before calling `onPressEnd`.
  delayPressEnd?: ?number,
  // Called when a long press gesture has been triggered.
  onLongPress?: ?(event: ResponderEvent) => void,
  // Called when a press gestute has been triggered.
  onPress?: ?(event: ClickEvent) => void,
  // Called when the press is activated to provide visual feedback.
  onPressChange?: ?(event: ResponderEvent) => void,
  // Called when the press is activated to provide visual feedback.
  onPressStart?: ?(event: ResponderEvent) => void,
  // Called when the press location moves. (This should rarely be used.)
  onPressMove?: ?(event: ResponderEvent) => void,
  // Called when the press is deactivated to undo visual feedback.
  onPressEnd?: ?(event: ResponderEvent) => void
|}>;

export type EventHandlers = $ReadOnly<{|
  onClick: (event: ClickEvent) => void,
  onContextMenu: (event: ClickEvent) => void,
  onKeyDown: (event: KeyboardEvent) => void,
  onResponderGrant: (event: ResponderEvent) => void,
  onResponderMove: (event: ResponderEvent) => void,
  onResponderRelease: (event: ResponderEvent) => void,
  onResponderTerminate: (event: ResponderEvent) => void,
  onResponderTerminationRequest: (event: ResponderEvent) => boolean,
  onStartShouldSetResponder: (event: ResponderEvent) => boolean
|}>;

type TouchState =
  | 'NOT_RESPONDER'
  | 'RESPONDER_INACTIVE_PRESS_START'
  | 'RESPONDER_ACTIVE_PRESS_START'
  | 'RESPONDER_ACTIVE_LONG_PRESS_START'
  | 'ERROR';

type TouchSignal =
  | 'DELAY'
  | 'RESPONDER_GRANT'
  | 'RESPONDER_RELEASE'
  | 'RESPONDER_TERMINATED'
  | 'LONG_PRESS_DETECTED';

const DELAY = 'DELAY';
const ERROR = 'ERROR';
const LONG_PRESS_DETECTED = 'LONG_PRESS_DETECTED';
const NOT_RESPONDER = 'NOT_RESPONDER';
const RESPONDER_ACTIVE_LONG_PRESS_START = 'RESPONDER_ACTIVE_LONG_PRESS_START';
const RESPONDER_ACTIVE_PRESS_START = 'RESPONDER_ACTIVE_PRESS_START';
const RESPONDER_INACTIVE_PRESS_START = 'RESPONDER_INACTIVE_PRESS_START';
const RESPONDER_GRANT = 'RESPONDER_GRANT';
const RESPONDER_RELEASE = 'RESPONDER_RELEASE';
const RESPONDER_TERMINATED = 'RESPONDER_TERMINATED';

const Transitions = Object.freeze({
  NOT_RESPONDER: {
    DELAY: ERROR,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: ERROR,
    RESPONDER_TERMINATED: ERROR,
    LONG_PRESS_DETECTED: ERROR
  },
  RESPONDER_INACTIVE_PRESS_START: {
    DELAY: RESPONDER_ACTIVE_PRESS_START,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: ERROR
  },
  RESPONDER_ACTIVE_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START
  },
  RESPONDER_ACTIVE_LONG_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START
  },
  ERROR: {
    DELAY: NOT_RESPONDER,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: NOT_RESPONDER
  }
});

const getElementRole = (element) => element.getAttribute('role');

const getElementType = (element) => element.tagName.toLowerCase();

const isActiveSignal = (signal) =>
  signal === RESPONDER_ACTIVE_PRESS_START ||
  signal === RESPONDER_ACTIVE_LONG_PRESS_START;

const isButtonRole = (element) => getElementRole(element) === 'button';

const isPressStartSignal = (signal) =>
  signal === RESPONDER_INACTIVE_PRESS_START ||
  signal === RESPONDER_ACTIVE_PRESS_START ||
  signal === RESPONDER_ACTIVE_LONG_PRESS_START;

const isTerminalSignal = (signal) =>
  signal === RESPONDER_TERMINATED || signal === RESPONDER_RELEASE;

const isValidKeyPress = (event) => {
  const { key, target } = event;
  const isSpacebar = key === ' ' || key === 'Spacebar';
  const isButtonish =
    getElementType(target) === 'button' || isButtonRole(target);
  return key === 'Enter' || (isSpacebar && isButtonish);
};

const DEFAULT_LONG_PRESS_DELAY_MS = 450; // 500 - 50
const DEFAULT_PRESS_DELAY_MS = 50;

/**
 * =========================== PressResponder Tutorial ===========================
 *
 * The `PressResponder` class helps you create press interactions by analyzing the
 * geometry of elements and observing when another responder (e.g. ScrollView)
 * has stolen the touch lock. It offers hooks for your component to provide
 * interaction feedback to the user:
 *
 * - When a press has activated (e.g. highlight an element)
 * - When a press has deactivated (e.g. un-highlight an element)
 * - When a press sould trigger an action, meaning it activated and deactivated
 *   while within the geometry of the element without the lock being stolen.
 *
 * A high quality interaction isn't as simple as you might think. There should
 * be a slight delay before activation. Moving your finger beyond an element's
 * bounds should trigger deactivation, but moving the same finger back within an
 * element's bounds should trigger reactivation.
 *
 * In order to use `PressResponder`, do the following:
 *
 *     const pressResponder = new PressResponder(config);
 *
 * 2. Choose the rendered component who should collect the press events. On that
 *    element, spread `pressability.getEventHandlers()` into its props.
 *
 *    return (
 *      <View {...this.state.pressResponder.getEventHandlers()} />
 *    );
 *
 * 3. Reset `PressResponder` when your component unmounts.
 *
 *    componentWillUnmount() {
 *      this.state.pressResponder.reset();
 *    }
 *
 * ==================== Implementation Details ====================
 *
 * `PressResponder` only assumes that there exists a `HitRect` node. The `PressRect`
 * is an abstract box that is extended beyond the `HitRect`.
 *
 * # Geometry
 *
 *  ┌────────────────────────┐
 *  │  ┌──────────────────┐  │ - Presses start anywhere within `HitRect`.
 *  │  │  ┌────────────┐  │  │
 *  │  │  │ VisualRect │  │  │
 *  │  │  └────────────┘  │  │ - When pressed down for sufficient amount of time
 *  │  │    HitRect       │  │   before letting up, `VisualRect` activates.
 *  │  └──────────────────┘  │
 *  │       Out Region   o   │
 *  └────────────────────│───┘
 *                       └────── When the press is released outside the `HitRect`,
 *                               the responder is NOT eligible for a "press".
 *
 * # State Machine
 *
 * ┌───────────────┐ ◀──── RESPONDER_RELEASE
 * │ NOT_RESPONDER │
 * └───┬───────────┘ ◀──── RESPONDER_TERMINATED
 *     │
 *     │ RESPONDER_GRANT (HitRect)
 *     │
 *     ▼
 * ┌─────────────────────┐          ┌───────────────────┐              ┌───────────────────┐
 * │ RESPONDER_INACTIVE_ │  DELAY   │ RESPONDER_ACTIVE_ │  T + DELAY   │ RESPONDER_ACTIVE_ │
 * │ PRESS_START         ├────────▶ │ PRESS_START       ├────────────▶ │ LONG_PRESS_START  │
 * └─────────────────────┘          └───────────────────┘              └───────────────────┘
 *
 * T + DELAY => LONG_PRESS_DELAY + DELAY
 *
 * Not drawn are the side effects of each transition. The most important side
 * effect is the invocation of `onLongPress`. Only when the browser produces a
 * `click` event is `onPress` invoked.
 */
export default class PressResponder {
  _config: PressResponderConfig;
  _eventHandlers: ?EventHandlers = null;
  _isPointerTouch: ?boolean = false;
  _longPressDelayTimeout: ?TimeoutID = null;
  _longPressDispatched: ?boolean = false;
  _pressDelayTimeout: ?TimeoutID = null;
  _pressOutDelayTimeout: ?TimeoutID = null;
  _selectionTerminated: ?boolean;
  _touchActivatePosition: ?$ReadOnly<{|
    pageX: number,
    pageY: number
  |}>;
  _touchState: TouchState = NOT_RESPONDER;
  _responderElement: ?HTMLElement = null;

  constructor(config: PressResponderConfig) {
    this.configure(config);
  }

  configure(config: PressResponderConfig): void {
    this._config = config;
  }

  /**
   * Resets any pending timers. This should be called on unmount.
   */
  reset(): void {
    this._cancelLongPressDelayTimeout();
    this._cancelPressDelayTimeout();
    this._cancelPressOutDelayTimeout();
  }

  /**
   * Returns a set of props to spread into the interactive element.
   */
  getEventHandlers(): EventHandlers {
    if (this._eventHandlers == null) {
      this._eventHandlers = this._createEventHandlers();
    }
    return this._eventHandlers;
  }

  _createEventHandlers(): EventHandlers {
    const start = (event: ResponderEvent, shouldDelay?: boolean): void => {
      event.persist();

      this._cancelPressOutDelayTimeout();

      this._longPressDispatched = false;
      this._selectionTerminated = false;
      this._touchState = NOT_RESPONDER;
      this._isPointerTouch = event.nativeEvent.type === 'touchstart';

      this._receiveSignal(RESPONDER_GRANT, event);

      const delayPressStart = normalizeDelay(
        this._config.delayPressStart,
        0,
        DEFAULT_PRESS_DELAY_MS
      );

      if (shouldDelay !== false && delayPressStart > 0) {
        this._pressDelayTimeout = setTimeout(() => {
          this._receiveSignal(DELAY, event);
        }, delayPressStart);
      } else {
        this._receiveSignal(DELAY, event);
      }

      const delayLongPress = normalizeDelay(
        this._config.delayLongPress,
        10,
        DEFAULT_LONG_PRESS_DELAY_MS
      );
      this._longPressDelayTimeout = setTimeout(() => {
        this._handleLongPress(event);
      }, delayLongPress + delayPressStart);
    };

    const end = (event: ResponderEvent): void => {
      this._receiveSignal(RESPONDER_RELEASE, event);
    };

    const keyupHandler = (event: KeyboardEvent) => {
      const { onPress } = this._config;
      const { target } = event;

      if (this._touchState !== NOT_RESPONDER && isValidKeyPress(event)) {
        end(event);
        document.removeEventListener('keyup', keyupHandler);

        const role = target.getAttribute('role');
        const elementType = getElementType(target);

        const isNativeInteractiveElement =
          role === 'link' ||
          elementType === 'a' ||
          elementType === 'button' ||
          elementType === 'input' ||
          elementType === 'select' ||
          elementType === 'textarea';
        const isActiveElement = this._responderElement === target;

        if (onPress != null && !isNativeInteractiveElement && isActiveElement) {
          onPress(event);
        }

        this._responderElement = null;
      }
    };

    return {
      onStartShouldSetResponder: (event): boolean => {
        const { disabled } = this._config;
        if (disabled && isButtonRole(event.currentTarget)) {
          event.stopPropagation();
        }
        if (disabled == null) {
          return true;
        }
        return !disabled;
      },

      onKeyDown: (event) => {
        const { disabled } = this._config;
        const { key, target } = event;
        if (!disabled && isValidKeyPress(event)) {
          if (this._touchState === NOT_RESPONDER) {
            start(event, false);
            this._responderElement = target;
            // Listen to 'keyup' on document to account for situations where
            // focus is moved to another element during 'keydown'.
            document.addEventListener('keyup', keyupHandler);
          }
          const isSpacebarKey = key === ' ' || key === 'Spacebar';
          const role = getElementRole(target);
          const isButtonLikeRole = role === 'button' || role === 'menuitem';
          if (
            isSpacebarKey &&
            isButtonLikeRole &&
            getElementType(target) !== 'button'
          ) {
            // Prevent spacebar scrolling the window if using non-native button
            event.preventDefault();
          }
          event.stopPropagation();
        }
      },

      onResponderGrant: (event) => start(event),

      onResponderMove: (event) => {
        if (this._config.onPressMove != null) {
          this._config.onPressMove(event);
        }
        const touch = getTouchFromResponderEvent(event);
        if (this._touchActivatePosition != null) {
          const deltaX = this._touchActivatePosition.pageX - touch.pageX;
          const deltaY = this._touchActivatePosition.pageY - touch.pageY;
          if (Math.hypot(deltaX, deltaY) > 10) {
            this._cancelLongPressDelayTimeout();
          }
        }
      },

      onResponderRelease: (event) => end(event),

      onResponderTerminate: (event) => {
        if (event.nativeEvent.type === 'selectionchange') {
          this._selectionTerminated = true;
        }
        this._receiveSignal(RESPONDER_TERMINATED, event);
      },

      onResponderTerminationRequest: (event): boolean => {
        const { cancelable, disabled, onLongPress } = this._config;
        // If `onLongPress` is provided, don't terminate on `contextmenu` as default
        // behavior will be prevented for non-mouse pointers.
        if (
          !disabled &&
          onLongPress != null &&
          this._isPointerTouch &&
          event.nativeEvent.type === 'contextmenu'
        ) {
          return false;
        }
        if (cancelable == null) {
          return true;
        }
        return cancelable;
      },

      // NOTE: this diverges from react-native in 3 significant ways:
      // * The `onPress` callback is not connected to the responder system (the native
      //  `click` event must be used but is dispatched in many scenarios where no pointers
      //   are on the screen.) Therefore, it's possible for `onPress` to be called without
      //   `onPress{Start,End}` being called first.
      // * The `onPress` callback is only be called on the first ancestor of the native
      //   `click` target that is using the PressResponder.
      // * The event's `nativeEvent` is a `MouseEvent` not a `TouchEvent`.
      onClick: (event: any): void => {
        const { disabled, onPress } = this._config;
        if (!disabled) {
          // If long press dispatched, cancel default click behavior.
          // If the responder terminated because text was selected during the gesture,
          // cancel the default click behavior.
          event.stopPropagation();
          if (this._longPressDispatched || this._selectionTerminated) {
            event.preventDefault();
          } else if (onPress != null && event.altKey === false) {
            onPress(event);
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation();
          }
        }
      },

      // If `onLongPress` is provided and a touch pointer is being used, prevent the
      // default context menu from opening.
      onContextMenu: (event: any): void => {
        const { disabled, onLongPress } = this._config;
        if (!disabled) {
          if (
            onLongPress != null &&
            this._isPointerTouch &&
            !event.defaultPrevented
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation();
          }
        }
      }
    };
  }

  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   */
  _receiveSignal(signal: TouchSignal, event: ResponderEvent): void {
    const prevState = this._touchState;
    let nextState = null;
    if (Transitions[prevState] != null) {
      nextState = Transitions[prevState][signal];
    }
    if (this._touchState === NOT_RESPONDER && signal === RESPONDER_RELEASE) {
      return;
    }
    if (nextState == null || nextState === ERROR) {
      console.error(
        `PressResponder: Invalid signal ${signal} for state ${prevState} on responder`
      );
    } else if (prevState !== nextState) {
      this._performTransitionSideEffects(prevState, nextState, signal, event);
      this._touchState = nextState;
    }
  }

  /**
   * Performs a transition between touchable states and identify any activations
   * or deactivations (and callback invocations).
   */
  _performTransitionSideEffects(
    prevState: TouchState,
    nextState: TouchState,
    signal: TouchSignal,
    event: ResponderEvent
  ): void {
    if (isTerminalSignal(signal)) {
      // Pressable suppression of contextmenu on windows.
      // On Windows, the contextmenu is displayed after pointerup.
      // https://github.com/necolas/react-native-web/issues/2296
      setTimeout(() => {
        this._isPointerTouch = false;
      }, 0);
      this._touchActivatePosition = null;
      this._cancelLongPressDelayTimeout();
    }

    if (isPressStartSignal(prevState) && signal === LONG_PRESS_DETECTED) {
      const { onLongPress } = this._config;
      // Long press is not supported for keyboards because 'click' can be dispatched
      // immediately (and multiple times) after 'keydown'.
      if (onLongPress != null && event.nativeEvent.key == null) {
        onLongPress(event);
        this._longPressDispatched = true;
      }
    }

    const isPrevActive = isActiveSignal(prevState);
    const isNextActive = isActiveSignal(nextState);

    if (!isPrevActive && isNextActive) {
      this._activate(event);
    } else if (isPrevActive && !isNextActive) {
      this._deactivate(event);
    }

    if (isPressStartSignal(prevState) && signal === RESPONDER_RELEASE) {
      const { onLongPress, onPress } = this._config;
      if (onPress != null) {
        const isPressCanceledByLongPress =
          onLongPress != null &&
          prevState === RESPONDER_ACTIVE_LONG_PRESS_START;
        if (!isPressCanceledByLongPress) {
          // If we never activated (due to delays), activate and deactivate now.
          if (!isNextActive && !isPrevActive) {
            this._activate(event);
            this._deactivate(event);
          }
        }
      }
    }

    this._cancelPressDelayTimeout();
  }

  _activate(event: ResponderEvent): void {
    const { onPressChange, onPressStart } = this._config;
    const touch = getTouchFromResponderEvent(event);
    this._touchActivatePosition = {
      pageX: touch.pageX,
      pageY: touch.pageY
    };
    if (onPressStart != null) {
      onPressStart(event);
    }
    if (onPressChange != null) {
      onPressChange(true);
    }
  }

  _deactivate(event: ResponderEvent): void {
    const { onPressChange, onPressEnd } = this._config;
    function end() {
      if (onPressEnd != null) {
        onPressEnd(event);
      }
      if (onPressChange != null) {
        onPressChange(false);
      }
    }
    const delayPressEnd = normalizeDelay(this._config.delayPressEnd);
    if (delayPressEnd > 0) {
      this._pressOutDelayTimeout = setTimeout(() => {
        end();
      }, delayPressEnd);
    } else {
      end();
    }
  }

  _handleLongPress(event: ResponderEvent): void {
    if (
      this._touchState === RESPONDER_ACTIVE_PRESS_START ||
      this._touchState === RESPONDER_ACTIVE_LONG_PRESS_START
    ) {
      this._receiveSignal(LONG_PRESS_DETECTED, event);
    }
  }

  _cancelLongPressDelayTimeout(): void {
    if (this._longPressDelayTimeout != null) {
      clearTimeout(this._longPressDelayTimeout);
      this._longPressDelayTimeout = null;
    }
  }

  _cancelPressDelayTimeout(): void {
    if (this._pressDelayTimeout != null) {
      clearTimeout(this._pressDelayTimeout);
      this._pressDelayTimeout = null;
    }
  }

  _cancelPressOutDelayTimeout(): void {
    if (this._pressOutDelayTimeout != null) {
      clearTimeout(this._pressOutDelayTimeout);
      this._pressOutDelayTimeout = null;
    }
  }
}

function normalizeDelay(delay: ?number, min = 0, fallback = 0): number {
  return Math.max(min, delay ?? fallback);
}

function getTouchFromResponderEvent(event: ResponderEvent) {
  const { changedTouches, touches } = event.nativeEvent;
  if (touches != null && touches.length > 0) {
    return touches[0];
  }
  if (changedTouches != null && changedTouches.length > 0) {
    return changedTouches[0];
  }
  return event.nativeEvent;
}
