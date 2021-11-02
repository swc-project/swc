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
var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
try {
    for(var array, _step, _iterator = array[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)var _ref = _step.value;
    _ref.x, _objectWithoutProperties(_ref, [
        "x"
    ]);
} catch (err) {
    _didIteratorError = !0, _iteratorError = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError) throw _iteratorError;
    }
}
var _iteratorNormalCompletion1 = !0, _didIteratorError1 = !1, _iteratorError1 = void 0;
try {
    for(var _step1, _iterator1 = array[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = !0)var _ref1 = _step1.value;
    _ref1.x, _objectWithoutProperties(_ref1, [
        "x"
    ]);
} catch (err) {
    _didIteratorError1 = !0, _iteratorError1 = err;
} finally{
    try {
        _iteratorNormalCompletion1 || null == _iterator1.return || _iterator1.return();
    } finally{
        if (_didIteratorError1) throw _iteratorError1;
    }
}
var _iteratorNormalCompletion2 = !0, _didIteratorError2 = !1, _iteratorError2 = void 0;
try {
    for(var _step2, _iterator2 = array.map(function(a) {
        return (function(target) {
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
        });
    })[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = !0){
        var norest = _step2.value;
        norest.x, norest.y;
    }
} catch (err) {
    _didIteratorError2 = !0, _iteratorError2 = err;
} finally{
    try {
        _iteratorNormalCompletion2 || null == _iterator2.return || _iterator2.return();
    } finally{
        if (_didIteratorError2) throw _iteratorError2;
    }
}
