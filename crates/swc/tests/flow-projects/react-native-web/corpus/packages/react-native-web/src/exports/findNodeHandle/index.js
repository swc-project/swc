/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

const findNodeHandle = (component) => {
  throw new Error(
    'findNodeHandle is not supported on web. ' +
      'Use the ref property on the component instead.'
  );
};

export default findNodeHandle;
