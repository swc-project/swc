/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

type I18nManagerStatus = {
  allowRTL: (allowRTL: boolean) => void,
  forceRTL: (forceRTL: boolean) => void,
  getConstants: () => Constants
};

type Constants = {
  isRTL: boolean
};

const I18nManager: I18nManagerStatus = {
  allowRTL() {
    return;
  },
  forceRTL() {
    return;
  },
  getConstants(): Constants {
    return { isRTL: false };
  }
};

export default I18nManager;
