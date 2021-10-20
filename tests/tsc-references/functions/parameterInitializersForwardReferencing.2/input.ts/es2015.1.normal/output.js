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
// @target: es5, es2015, esnext
// @noEmit: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
function a() {
}
function b(_param = a()) {
    var { b =a()  } = _param, x = _objectWithoutProperties(_param, [
        "b"
    ]);
    var a1;
}
const x = "";
function c(_param = a(), d = x) {
    var { b  } = _param, c = _objectWithoutProperties(_param, [
        "b"
    ]);
    var x;
}
