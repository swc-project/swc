import _array_without_holes from "./_array_without_holes.mjs";
import _iterable_to_array from "./_iterable_to_array.mjs";
import _non_iterable_spread from "./_non_iterable_spread.mjs";
import _unsupported_iterable_to_array from "./_unsupported_iterable_to_array.mjs";
export default function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
