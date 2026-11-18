/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import PooledClass from '../../vendor/react-native/PooledClass';

const twoArgumentPooler = PooledClass.twoArgumentPooler;

/**
 * PooledClass representing the bounding rectangle of a region.
 */
function BoundingDimensions(width: number, height: number) {
  this.width = width;
  this.height = height;
}

BoundingDimensions.prototype.destructor = function () {
  this.width = null;
  this.height = null;
};

BoundingDimensions.getPooledFromElement = function (element: HTMLElement): any {
  return BoundingDimensions.getPooled(
    element.offsetWidth,
    element.offsetHeight
  );
};

PooledClass.addPoolingTo(BoundingDimensions, twoArgumentPooler);

export default BoundingDimensions;
