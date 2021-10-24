function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
// Declaration forms for array destructuring
// Destructuring from a simple array -> include undefined
var _strArray = _slicedToArray(strArray, 1), s1 = _strArray[0];
s1.toString(); // Should error, s1 possibly undefined
// Destructuring a rest element -> do not include undefined
var _strArray1 = _toArray(strArray), s2 = _strArray1.slice(0);
s2.push(undefined); // Should error, 'undefined' not part of s2's element type
// Destructuring a rest element -> do not include undefined
var _strArray2 = _toArray(strArray), s3 = _strArray2.slice(2);
s3.push(undefined); // Should error, 'undefined' not part of s2's element type
var t1 = strMap.t1;
t1.toString(); // Should error, t1 possibly undefined
var t2 = _extends({
}, strMap);
t2.z.toString(); // Should error
{
    var x = numMapPoint.x, y = numMapPoint.y, z = numMapPoint.z;
    x.toFixed(); // Should OK
    y.toFixed(); // Should OK
    z.toFixed(); // Should error
}{
    var x1 = numMapPoint.x, q = _objectWithoutProperties(numMapPoint, [
        "x"
    ]);
    x1.toFixed(); // Should OK
    q.y.toFixed(); // Should OK
    q.z.toFixed(); // Should error
}var ref;
ref = strArray, target_string = ref[0], ref; // Should error
var ref1;
ref1 = strArray, target_string_undef = ref1[0], ref1; // Should OK
var ref2;
ref2 = strArray, target_string_arr = ref2.slice(3), ref2; // Should OK
{
    var x2, y1, z1;
    var ref3;
    ref3 = numMapPoint, x2 = ref3.x, y1 = ref3.y, z1 = ref3.z, ref3; // Should OK
    var q1;
    q1 = numMapPoint.q; // Should error
}
