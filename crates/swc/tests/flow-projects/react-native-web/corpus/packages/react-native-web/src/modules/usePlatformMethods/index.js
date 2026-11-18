/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { GenericStyleProp } from '../../types';
import type { ViewProps } from '../../exports/View';

import UIManager from '../../exports/UIManager';
import useStable from '../useStable';

/**
 * Adds non-standard methods to the hode element. This is temporarily until an
 * API like `ReactNative.measure(hostRef, callback)` is added to React Native.
 */
export default function usePlatformMethods({
  pointerEvents,
  style
}: {
  style?: GenericStyleProp<*>,
  pointerEvents?: $PropertyType<ViewProps, 'pointerEvents'>
}): (hostNode: any) => void {
  // Avoid creating a new ref on every render.
  const ref = useStable(() => (hostNode: any) => {
    if (hostNode != null) {
      hostNode.measure = (callback) => UIManager.measure(hostNode, callback);
      hostNode.measureLayout = (relativeToNode, success, failure) =>
        UIManager.measureLayout(hostNode, relativeToNode, failure, success);
      hostNode.measureInWindow = (callback) =>
        UIManager.measureInWindow(hostNode, callback);
    }
  });

  return ref;
}
