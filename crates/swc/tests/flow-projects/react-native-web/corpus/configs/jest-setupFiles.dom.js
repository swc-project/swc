/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// JSDOM doesn't implement ResizeObserver
class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}
window.ResizeObserver = ResizeObserver;

// JSDOM doesn't provide values for 'clientWidth' etc
Object.defineProperty(window.document.documentElement, 'clientHeight', {
  get: function () {
    return this._jsdomClientWidth || window.innerHeight;
  }
});
Object.defineProperty(window.document.documentElement, 'clientWidth', {
  get: function () {
    return this._jsdomClientWidth || window.innerWidth;
  }
});
