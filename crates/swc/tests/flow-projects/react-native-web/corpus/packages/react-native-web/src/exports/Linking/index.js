/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'fbjs/lib/invariant';
import canUseDOM from '../../modules/canUseDom';

const initialURL = canUseDOM ? window.location.href : '';

type Callback = (...args: any) => void;

class Linking {
  /**
   * An object mapping of event name
   * and all the callbacks subscribing to it
   */
  _eventCallbacks: { [key: string]: Array<Callback> } = {};

  _dispatchEvent(event: string, ...data: any) {
    const listeners = this._eventCallbacks[event];
    if (listeners != null && Array.isArray(listeners)) {
      listeners.map((listener) => {
        listener(...data);
      });
    }
  }

  /**
   * Adds a event listener for the specified event. The callback will be called when the
   * said event is dispatched.
   */
  addEventListener(
    eventType: string,
    callback: Callback
  ): {| remove(): void |} {
    const _this = this;

    if (!_this._eventCallbacks[eventType]) {
      _this._eventCallbacks[eventType] = [callback];
    }
    _this._eventCallbacks[eventType].push(callback);

    return {
      remove() {
        const callbacks = _this._eventCallbacks[eventType];
        const filteredCallbacks = callbacks.filter(
          (c) => c.toString() !== callback.toString()
        );
        _this._eventCallbacks[eventType] = filteredCallbacks;
      }
    };
  }

  /**
   * Removes a previously added event listener for the specified event. The callback must
   * be the same object as the one passed to `addEventListener`.
   */
  removeEventListener(eventType: string, callback: Callback): void {
    console.error(
      `Linking.removeEventListener('${eventType}', ...): Method has been ` +
        'deprecated. Please instead use `remove()` on the subscription ' +
        'returned by `Linking.addEventListener`.'
    );
    const callbacks = this._eventCallbacks[eventType];
    const filteredCallbacks = callbacks.filter(
      (c) => c.toString() !== callback.toString()
    );
    this._eventCallbacks[eventType] = filteredCallbacks;
  }

  canOpenURL(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getInitialURL(): Promise<string> {
    return Promise.resolve(initialURL);
  }

  /**
   * Try to open the given url in a secure fashion. The method returns a Promise object.
   * If a target is passed (including undefined) that target will be used, otherwise '_blank'.
   * If the url opens, the promise is resolved. If not, the promise is rejected.
   * Dispatches the `onOpen` event if `url` is opened successfully.
   */
  openURL(url: string, target?: string): Promise<Object | void> {
    if (arguments.length === 1) {
      target = '_blank';
    }
    try {
      open(url, target);
      this._dispatchEvent('onOpen', url);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  _validateURL(url: string) {
    invariant(
      typeof url === 'string',
      'Invalid URL: should be a string. Was: ' + url
    );
    invariant(url, 'Invalid URL: cannot be empty');
  }
}

const open = (url, target) => {
  if (canUseDOM) {
    const urlToOpen = new URL(url, window.location).toString();
    if (urlToOpen.indexOf('tel:') === 0) {
      window.location = urlToOpen;
    } else {
      window.open(urlToOpen, target, 'noopener');
    }
  }
};

export default (new Linking(): Linking);
