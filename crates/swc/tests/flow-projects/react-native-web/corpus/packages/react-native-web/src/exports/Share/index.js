/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'fbjs/lib/invariant';

type Content =
  | { title?: string, message?: string, url: string }
  | { title?: string, message: string, url?: string };

class Share {
  static share(content: Content, options: Object = {}): Promise<Object> {
    invariant(
      typeof content === 'object' && content !== null,
      'Content to share must be a valid object'
    );
    invariant(
      typeof content.url === 'string' || typeof content.message === 'string',
      'At least one of URL and message is required'
    );
    invariant(
      typeof options === 'object' && options !== null,
      'Options must be a valid object'
    );
    invariant(
      !content.title || typeof content.title === 'string',
      'Invalid title: title should be a string.'
    );

    if (window.navigator.share !== undefined) {
      return window.navigator.share({
        title: content.title,
        text: content.message,
        url: content.url
      });
    } else {
      return Promise.reject(
        new Error('Share is not supported in this browser')
      );
    }
  }

  /**
   * The content was successfully shared.
   */
  static get sharedAction(): string {
    return 'sharedAction';
  }

  /**
   * The dialog has been dismissed.
   * @platform ios
   */
  static get dismissedAction(): string {
    return 'dismissedAction';
  }
}

export default Share;
