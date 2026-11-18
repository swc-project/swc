/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use client';

let clipboardAvailable;

export default class Clipboard {
  static isAvailable(): boolean {
    if (clipboardAvailable === undefined) {
      clipboardAvailable =
        typeof document.queryCommandSupported === 'function' &&
        document.queryCommandSupported('copy');
    }
    return clipboardAvailable;
  }

  static getString(): Promise<string> {
    return Promise.resolve('');
  }

  static setString(text: string): boolean {
    let success = false;
    const body = document.body;

    if (body) {
      // add the text to a hidden node
      const node = document.createElement('span');
      node.textContent = text;
      node.style.opacity = '0';
      node.style.position = 'absolute';
      node.style.whiteSpace = 'pre-wrap';
      node.style.userSelect = 'auto';
      body.appendChild(node);

      // select the text
      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.addRange(range);

      // attempt to copy
      try {
        document.execCommand('copy');
        success = true;
      } catch (e) {}

      // remove selection and node
      selection.removeAllRanges();
      body.removeChild(node);
    }

    return success;
  }
}
