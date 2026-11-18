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

import type { EventHandlers, PressResponderConfig } from './PressResponder';

import PressResponder from './PressResponder';
import { useDebugValue, useEffect, useRef } from 'react';

export default function usePressEvents(
  hostRef: any,
  config: PressResponderConfig
): EventHandlers {
  const pressResponderRef = useRef<?PressResponder>(null);
  if (pressResponderRef.current == null) {
    pressResponderRef.current = new PressResponder(config);
  }
  const pressResponder = pressResponderRef.current;

  // Re-configure to use the current node and configuration.
  useEffect(() => {
    pressResponder.configure(config);
  }, [config, pressResponder]);

  // Reset the `pressResponder` when cleanup needs to occur. This is
  // a separate effect because we do not want to rest the responder when `config` changes.
  useEffect(() => {
    return () => {
      pressResponder.reset();
    };
  }, [pressResponder]);

  useDebugValue(config);

  return pressResponder.getEventHandlers();
}
