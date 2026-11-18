/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ViewProps } from '../View';

import * as React from 'react';
import StyleSheet from '../StyleSheet';
import View from '../View';
import canUseDOM from '../../modules/canUseDom';

const cssFunction: 'constant' | 'env' = (function () {
  if (
    canUseDOM &&
    window.CSS &&
    window.CSS.supports &&
    window.CSS.supports('top: constant(safe-area-inset-top)')
  ) {
    return 'constant';
  }
  return 'env';
})();

const SafeAreaView: React.AbstractComponent<
  ViewProps,
  React.ElementRef<typeof View>
> = React.forwardRef((props, ref) => {
  const { style, ...rest } = props;
  return <View {...rest} ref={ref} style={[styles.root, style]} />;
});

SafeAreaView.displayName = 'SafeAreaView';

const styles = StyleSheet.create({
  root: {
    paddingTop: `${cssFunction}(safe-area-inset-top)`,
    paddingRight: `${cssFunction}(safe-area-inset-right)`,
    paddingBottom: `${cssFunction}(safe-area-inset-bottom)`,
    paddingLeft: `${cssFunction}(safe-area-inset-left)`
  }
});

export default SafeAreaView;
