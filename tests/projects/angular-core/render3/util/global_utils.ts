/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {assertDefined} from '../../util/assert';
import {global} from '../../util/global';
import {getComponent, getContext, getDebugNode, getDirectives, getHostElement, getInjector, getListeners, getRootComponents, getViewComponent, markDirty} from '../global_utils_api';



/**
 * This file introduces series of globally accessible debug tools
 * to allow for the Angular debugging story to function.
 *
 * To see this in action run the following command:
 *
 *   bazel run --define=compile=aot
 *   //packages/core/test/bundling/todo:devserver
 *
 *  Then load `localhost:5432` and start using the console tools.
 */

/**
 * This value reflects the property on the window where the dev
 * tools are patched (window.ng).
 * */
export const GLOBAL_PUBLISH_EXPANDO_KEY = 'ng';

let _published = false;
/**
 * Publishes a collection of default debug tools onto`window.ng`.
 *
 * These functions are available globally when Angular is in development
 * mode and are automatically stripped away from prod mode is on.
 */
export function publishDefaultGlobalUtils() {
  if (!_published) {
    _published = true;
    publishGlobalUtil('getComponent', getComponent);
    publishGlobalUtil('getContext', getContext);
    publishGlobalUtil('getListeners', getListeners);
    publishGlobalUtil('getViewComponent', getViewComponent);
    publishGlobalUtil('getHostElement', getHostElement);
    publishGlobalUtil('getInjector', getInjector);
    publishGlobalUtil('getRootComponents', getRootComponents);
    publishGlobalUtil('getDirectives', getDirectives);
    publishGlobalUtil('getDebugNode', getDebugNode);
    publishGlobalUtil('markDirty', markDirty);
  }
}

export declare type GlobalDevModeContainer = {
  [GLOBAL_PUBLISH_EXPANDO_KEY]: {[fnName: string]: Function};
};

/**
 * Publishes the given function to `window.ng` so that it can be
 * used from the browser console when an application is not in production.
 */
export function publishGlobalUtil(name: string, fn: Function): void {
  if (typeof COMPILED === 'undefined' || !COMPILED) {
    // Note: we can't export `ng` when using closure enhanced optimization as:
    // - closure declares globals itself for minified names, which sometimes clobber our `ng` global
    // - we can't declare a closure extern as the namespace `ng` is already used within Google
    //   for typings for AngularJS (via `goog.provide('ng....')`).
    const w = global as any as GlobalDevModeContainer;
    ngDevMode && assertDefined(fn, 'function not defined');
    if (w) {
      let container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
      if (!container) {
        container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
      }
      container[name] = fn;
    }
  }
}
