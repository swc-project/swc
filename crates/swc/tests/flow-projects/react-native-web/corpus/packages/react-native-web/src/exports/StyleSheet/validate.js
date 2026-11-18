/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import valueParser from 'postcss-value-parser';

const invalidShortforms = {
  background: true,
  borderBottom: true,
  borderLeft: true,
  borderRight: true,
  borderTop: true,
  font: true,
  grid: true,
  outline: true,
  textDecoration: true
};

const invalidMultiValueShortforms = {
  flex: true,
  margin: true,
  padding: true,
  borderColor: true,
  borderRadius: true,
  borderStyle: true,
  borderWidth: true,
  inset: true,
  insetBlock: true,
  insetInline: true,
  marginBlock: true,
  marginInline: true,
  marginHorizontal: true,
  marginVertical: true,
  paddingBlock: true,
  paddingInline: true,
  paddingHorizontal: true,
  paddingVertical: true,
  overflow: true,
  overscrollBehavior: true,
  backgroundPosition: true
};

function error(message) {
  console.error(message);
}

export function validate(obj: Object) {
  for (const k in obj) {
    const prop = k.trim();
    const value = obj[prop];
    let isInvalid = false;

    if (value === null) {
      continue;
    }

    if (typeof value === 'string' && value.indexOf('!important') > -1) {
      error(
        `Invalid style declaration "${prop}:${value}". Values cannot include "!important"`
      );
      isInvalid = true;
    } else {
      let suggestion = '';
      if (prop === 'animation' || prop === 'animationName') {
        suggestion = 'Did you mean "animationKeyframes"?';
        isInvalid = true;
      } else if (prop === 'direction') {
        suggestion = 'Did you mean "writingDirection"?';
        isInvalid = true;
      } else if (invalidShortforms[prop]) {
        suggestion = 'Please use long-form properties.';
        isInvalid = true;
      } else if (invalidMultiValueShortforms[prop]) {
        if (typeof value === 'string' && valueParser(value).nodes.length > 1) {
          suggestion = `Value is "${value}" but only single values are supported.`;
          isInvalid = true;
        }
      }
      if (suggestion !== '') {
        error(`Invalid style property of "${prop}". ${suggestion}`);
      }
    }

    if (isInvalid) {
      delete obj[k];
    }
  }
}
