/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

const uppercasePattern = /[A-Z]/g;
const msPattern = /^ms-/;
const cache = {};

function toHyphenLower(match) {
  return '-' + match.toLowerCase();
}

function hyphenateStyleName(name: string): string {
  if (name in cache) {
    return cache[name];
  }

  const hName = name.replace(uppercasePattern, toHyphenLower);
  return (cache[name] = msPattern.test(hName) ? '-' + hName : hName);
}

export default hyphenateStyleName;
