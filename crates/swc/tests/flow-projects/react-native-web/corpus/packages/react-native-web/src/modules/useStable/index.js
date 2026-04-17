/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import * as React from 'react';

const UNINITIALIZED =
  typeof Symbol === 'function' && typeof Symbol() === 'symbol'
    ? Symbol()
    : Object.freeze({});

export default function useStable<T>(getInitialValue: () => T): T {
  const ref = React.useRef(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = getInitialValue();
  }
  // $FlowFixMe (#64650789) Trouble refining types where `Symbol` is concerned.
  return ref.current;
}
