/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { Node } from 'React';
import type { ViewProps } from '../../exports/View/types';

import View from '../../exports/View';
import React from 'react';

/**
 * Common implementation for a simple stubbed view.
 */
function UnimplementedView({ style, ...props }: ViewProps): Node {
  return <View {...props} style={[unimplementedViewStyles, style]} />;
}

const unimplementedViewStyles =
  process.env.NODE_ENV !== 'production'
    ? {
        alignSelf: 'flex-start',
        borderColor: 'red',
        borderWidth: 1
      }
    : {};

export default UnimplementedView;
