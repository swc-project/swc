/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import PooledClass from '../../vendor/react-native/PooledClass';

const twoArgumentPooler = PooledClass.twoArgumentPooler;

function Position(left, top) {
  this.left = left;
  this.top = top;
}

Position.prototype.destructor = function () {
  this.left = null;
  this.top = null;
};

PooledClass.addPoolingTo(Position, twoArgumentPooler);

export default Position;
