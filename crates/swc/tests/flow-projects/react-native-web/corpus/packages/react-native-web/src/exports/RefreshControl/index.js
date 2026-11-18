/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ColorValue } from '../../types';
import type { ViewProps } from '../View';
import type { Node } from 'React';

import View from '../View';
import React from 'react';

type RefreshControlProps = {
  ...ViewProps,
  colors?: Array<ColorValue>,
  enabled?: boolean,
  onRefresh?: () => void,
  progressBackgroundColor?: ColorValue,
  progressViewOffset?: number,
  refreshing: boolean,
  size?: 0 | 1,
  tintColor?: ColorValue,
  title?: string,
  titleColor?: ColorValue
};

function RefreshControl(props: RefreshControlProps): Node {
  const {
    /* eslint-disable */
    colors,
    enabled,
    onRefresh,
    progressBackgroundColor,
    progressViewOffset,
    refreshing,
    size,
    tintColor,
    title,
    titleColor,
    /* eslint-enable */
    ...rest
  } = props;

  return <View {...rest} />;
}

export default RefreshControl;
