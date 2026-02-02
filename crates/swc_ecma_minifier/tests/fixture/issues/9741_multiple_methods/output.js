// Test multiple different methods being hoisted
var _Array_isArray = Array.isArray, _Object_assign = Object.assign, _Object_keys = Object.keys;
console.log(_Object_assign({}, {}), _Object_assign({}, {}), _Object_keys({
    a: 1
}), _Object_keys({
    b: 2
}), _Array_isArray([]), _Array_isArray({}));
