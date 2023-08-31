//// [arrayLiteralExpressionContextualTyping.ts]
// In a contextually typed array literal expression containing no spread elements, an element expression at index N is contextually typed by
//      the type of the property with the numeric name N in the contextual type, if any, or otherwise
//      the numeric index type of the contextual type, if any.
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var tup = [
    1,
    2,
    3,
    4
];
[
    1,
    2,
    3
].concat(_to_consumable_array([
    1,
    2,
    3
])), [
    1,
    2,
    3
].concat(_to_consumable_array(tup)), [
    1,
    2,
    3
].concat(_to_consumable_array(tup));
 // Error
