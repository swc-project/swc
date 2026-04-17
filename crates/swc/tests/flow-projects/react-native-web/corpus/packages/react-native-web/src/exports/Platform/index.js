/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const Platform = {
  OS: 'web',
  select: (obj: Object): any => ('web' in obj ? obj.web : obj.default),
  get isTesting(): boolean {
    if (process.env.NODE_ENV === 'test') {
      return true;
    }
    return false;
  },
  get Version(): string {
    return '0.0.0';
  }
};

export default Platform;
