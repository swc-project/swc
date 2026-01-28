// Test multiple different methods being hoisted
var _Object_keys = Object.keys, _Object_assign = Object.assign, _Array_isArray = Array.isArray;
console.log(_Object_assign({}, {}), _Object_assign({}, {}), _Object_keys({
    a: 1
}), _Object_keys({
    b: 2
}), _Array_isArray([]), _Array_isArray({}));
