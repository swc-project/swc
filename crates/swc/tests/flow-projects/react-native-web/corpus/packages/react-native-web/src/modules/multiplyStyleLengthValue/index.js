/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

const CSS_UNIT_RE = /^[+-]?\d*(?:\.\d+)?(?:[Ee][+-]?\d+)?(%|\w*)/;

const getUnit = (str) => str.match(CSS_UNIT_RE)[1];

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const multiplyStyleLengthValue = (value: string | number, multiple) => {
  if (typeof value === 'string') {
    const number = parseFloat(value) * multiple;
    const unit = getUnit(value);
    return `${number}${unit}`;
  } else if (isNumeric(value)) {
    return value * multiple;
  }
};

export default multiplyStyleLengthValue;
