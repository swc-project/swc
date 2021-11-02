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
function _throw(e) {
    throw e;
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
// @target: es2015
var ka;
var nested;
var other;
var rest;
var complex;
var _complex;
var ref;
_complex = complex, nested = _objectWithoutProperties(_complex.x, [
    "ka"
]), rest = _objectWithoutProperties(_complex, [
    "x",
    "y"
]), ref = _complex, ({ ka  } = ref.x), other = ref.y, ref, _complex;
// should be:
var overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var _a = _toArray(overEmit.a), ref1 = _a[0], ref1 = ref1 !== null ? ref1 : _throw(new TypeError("Cannot destructure undefined")), y = _a.slice(1), z = overEmit.b.z, nested2 = _extends({
}, overEmit.a[0]), c = _objectWithoutProperties(overEmit.b, [
    "z"
]), rest2 = _objectWithoutProperties(overEmit, [
    "a",
    "b"
]);
var _overEmit;
var ref2;
_overEmit = overEmit, nested2 = _extends({
}, _overEmit.a[0]), c = _objectWithoutProperties(_overEmit.b, [
    "z"
]), rest2 = _objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), ref2 = _overEmit, [{}, ...y] = ref2.a, ({ z  } = ref2.b), ref2, _overEmit;
