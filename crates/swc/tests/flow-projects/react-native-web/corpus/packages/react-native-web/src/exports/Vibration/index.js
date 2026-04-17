/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

type VibratePattern = number | Array<number>;

const vibrate = (pattern: VibratePattern) => {
  if ('vibrate' in window.navigator) {
    window.navigator.vibrate(pattern);
  }
};

const Vibration = {
  cancel() {
    vibrate(0);
  },
  vibrate(pattern: VibratePattern = 400) {
    vibrate(pattern);
  }
};

export default Vibration;
