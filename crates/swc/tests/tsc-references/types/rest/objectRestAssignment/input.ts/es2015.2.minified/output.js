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
let ka, other;
_objectWithoutProperties((_complex = void 0).x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
let overEmit;
var _complex, _overEmit, { a: [{}, ...y] , b: { z  }  } = overEmit;
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
]), { a: [{}, ...y] , b: { z  }  } = _overEmit;
