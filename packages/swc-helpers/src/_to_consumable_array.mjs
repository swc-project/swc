import arrayWithoutHoles from './_array_without_holes';
import iterableToArray from './_iterable_to_array';
import nonIterableSpread from './_non_iterable_spread';
import unsupportedIterableToArray from './_unsupported_iterable_to_array';

export default function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
