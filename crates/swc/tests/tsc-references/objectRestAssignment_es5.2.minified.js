function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
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
    if (null == source) return {};
    var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {};
    var key, i, target = {}, sourceKeys = Object.keys(source);
    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
    return target;
}
function _toArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
_objectWithoutProperties((_complex = complex).x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), (ref = _complex).x.ka, ref.y;
var complex, _complex, ref, overEmit, _overEmit, ref1, ref2, _a = _toArray(overEmit.a), ref3 = _a[0], ref3 = null !== ref3 ? ref3 : function(e) {
    throw e;
}(new TypeError("Cannot destructure undefined"));
_a.slice(1), overEmit.b.z, _extends({}, overEmit.a[0]), _objectWithoutProperties(overEmit.b, [
    "z"
]), _objectWithoutProperties(overEmit, [
    "a",
    "b"
]), _extends({}, (_overEmit = overEmit).a[0]), _objectWithoutProperties(_overEmit.b, [
    "z"
]), _objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), (ref2 = _toArray((ref1 = _overEmit).a))[0], ref2.slice(1), ref1.b.z;
