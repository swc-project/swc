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
let ka, other;
var _complex = void 0;
_objectWithoutProperties(_complex.x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
let overEmit;
var { a: [{}, ...y] , b: { z  }  } = overEmit, nested2 = _extends({}, overEmit.a[0]), c = _objectWithoutProperties(overEmit.b, [
    "z"
]), rest2 = _objectWithoutProperties(overEmit, [
    "a",
    "b"
]), _overEmit = overEmit;
_extends({}, _overEmit.a[0]), _objectWithoutProperties(_overEmit.b, [
    "z"
]), _objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), { a: [{}, ...y] , b: { z  }  } = _overEmit;
