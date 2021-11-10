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
// @target: es2015
let ka;
let nested;
let other;
let rest;
let complex;
var _complex;
_complex = complex, nested = _objectWithoutProperties(_complex.x, [
    "ka"
]), rest = _objectWithoutProperties(_complex, [
    "x",
    "y"
]), ({ x: { ka  } , y: other  } = _complex), _complex;
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: [{}, ...y] , b: { z  }  } = overEmit, nested2 = _extends({
}, overEmit.a[0]), c = _objectWithoutProperties(overEmit.b, [
    "z"
]), rest2 = _objectWithoutProperties(overEmit, [
    "a",
    "b"
]);
var _overEmit;
_overEmit = overEmit, nested2 = _extends({
}, _overEmit.a[0]), c = _objectWithoutProperties(_overEmit.b, [
    "z"
]), rest2 = _objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), ({ a: [{}, ...y] , b: { z  }  } = _overEmit), _overEmit;
