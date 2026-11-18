/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import Dimensions from '../Dimensions';

/**
 * PixelRatio gives access to the device pixel density.
 */
export default class PixelRatio {
  /**
   * Returns the device pixel density.
   */
  static get(): number {
    return Dimensions.get('window').scale;
  }

  /**
   * No equivalent for Web
   */
  static getFontScale(): number {
    return Dimensions.get('window').fontScale || PixelRatio.get();
  }

  /**
   * Converts a layout size (dp) to pixel size (px).
   * Guaranteed to return an integer number.
   */
  static getPixelSizeForLayoutSize(layoutSize: number): number {
    return Math.round(layoutSize * PixelRatio.get());
  }

  /**
   * Rounds a layout size (dp) to the nearest layout size that corresponds to
   * an integer number of pixels. For example, on a device with a PixelRatio
   * of 3, `PixelRatio.roundToNearestPixel(8.4) = 8.33`, which corresponds to
   * exactly (8.33 * 3) = 25 pixels.
   */
  static roundToNearestPixel(layoutSize: number): number {
    const ratio = PixelRatio.get();
    return Math.round(layoutSize * ratio) / ratio;
  }
}
