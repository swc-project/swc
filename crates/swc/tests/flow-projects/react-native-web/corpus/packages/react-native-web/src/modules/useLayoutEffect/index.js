/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * useLayoutEffect throws an error on the server. On the few occasions where is
 * problematic, use this hook.
 *
 * @flow
 */

import { useEffect, useLayoutEffect } from 'react';
import canUseDOM from '../canUseDom';

const useLayoutEffectImpl: typeof useLayoutEffect = canUseDOM
  ? useLayoutEffect
  : useEffect;

export default useLayoutEffectImpl;
