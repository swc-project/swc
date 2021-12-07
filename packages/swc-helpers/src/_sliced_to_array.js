import arrayWithHoles from './_array_with_holes';
import iterableToArrayLimit from './_iterable_to_array';
import nonIterableRest from './_non_iterable_rest';
import unsupportedIterableToArray from './_unsupported_iterable_to_array';

export default function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
