/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import * as React from 'react';
import mergeRefs from '../mergeRefs';

export default function useMergeRefs(
  ...args: $ReadOnlyArray<React.ElementRef<any>>
): (node: HTMLElement | null) => void {
  return React.useMemo(
    () => mergeRefs(...args),
    // eslint-disable-next-line
    [...args]
  );
}
