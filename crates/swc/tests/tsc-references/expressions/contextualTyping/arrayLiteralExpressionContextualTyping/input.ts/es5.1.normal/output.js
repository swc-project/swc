function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// In a contextually typed array literal expression containing no spread elements, an element expression at index N is contextually typed by
//      the type of the property with the numeric name N in the contextual type, if any, or otherwise
//      the numeric index type of the contextual type, if any.
var array = [
    1,
    2,
    3
];
var array1 = [
    true,
    2,
    3
]; // Contextual type by the numeric index type of the contextual type
var tup = [
    1,
    2,
    3,
    4
];
var tup1 = [
    1,
    2,
    3,
    "string"
];
var tup2 = [
    1,
    2,
    3,
    "string"
]; // Error
// In a contextually typed array literal expression containing one or more spread elements,
// an element expression at index N is contextually typed by the numeric index type of the contextual type, if any.
var spr = [
    1,
    2,
    3
].concat(_toConsumableArray(array));
var spr1 = [
    1,
    2,
    3
].concat(_toConsumableArray(tup));
var spr2 = [
    1,
    2,
    3
].concat(_toConsumableArray(tup)); // Error
