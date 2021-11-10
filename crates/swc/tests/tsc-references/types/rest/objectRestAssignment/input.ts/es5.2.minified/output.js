function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = {
    }, sourceKeys = Object.keys(source);
    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
    return target;
}
_objectWithoutProperties((_complex = complex).x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), ref = _complex, { ka  } = ref.x;
var arr, ka, complex, _complex, ref, overEmit, _overEmit, ref1, _a = function(arr) {
    if (Array.isArray(arr)) return arr;
}(arr = overEmit.a) || function(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}(arr) || function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}(), ref2 = _a[0], ref2 = null !== ref2 ? ref2 : function(e) {
    throw e;
}(new TypeError("Cannot destructure undefined")), y = _a.slice(1), z = overEmit.b.z;
_extends({
}, overEmit.a[0]), _objectWithoutProperties(overEmit.b, [
    "z"
]), _objectWithoutProperties(overEmit, [
    "a",
    "b"
]), _extends({
}, (_overEmit = overEmit).a[0]), _objectWithoutProperties(_overEmit.b, [
    "z"
]), _objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), ref1 = _overEmit, [{}, ...y] = ref1.a, { z  } = ref1.b;
