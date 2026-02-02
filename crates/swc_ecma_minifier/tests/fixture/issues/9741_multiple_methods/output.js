// Test multiple different methods being hoisted
var _Array_isArray = Array.isArray, _Object_assign = Object.assign;
console.log(_Object_assign({}, {}), _Object_assign({}, {}), [
    "a"
], [
    "b"
], _Array_isArray([]), _Array_isArray({}));
