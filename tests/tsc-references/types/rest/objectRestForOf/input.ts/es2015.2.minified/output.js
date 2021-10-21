function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
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
let array;
for (let _ref of array)var { x  } = _ref;
for (var _ref1 of (_objectWithoutProperties(_ref, [
    "x"
]), array))var { x: xx  } = _ref1;
for (const norest of (_objectWithoutProperties(_ref1, [
    "x"
]), array.map((a)=>(function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = null != arguments[i] ? arguments[i] : {
            }, ownKeys = Object.keys(source);
            "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }))), ownKeys.forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        }
        return target;
    })({
    }, a, {
        x: "a string"
    })
)))norest.x, norest.y;
