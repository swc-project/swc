import _arrayLikeToArray from './_array_like_to_array';

export default function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
