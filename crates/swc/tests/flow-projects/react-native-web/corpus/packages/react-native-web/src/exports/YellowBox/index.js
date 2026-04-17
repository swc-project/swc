/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { Node } from 'React';

import React from 'react';
import UnimplementedView from '../../modules/UnimplementedView';

function YellowBox(props: Object): Node {
  return <UnimplementedView {...props} />;
}

YellowBox.ignoreWarnings = () => {};

export default YellowBox;
