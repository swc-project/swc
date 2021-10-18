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
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @strict: true
// @target: es2015
var a = 'a';
function f1(obj) {
    var r0 = _extends({
    }, obj);
    var a1 = obj.a, r1 = _objectWithoutProperties(obj, [
        "a"
    ]);
    var a2 = obj.a, b2 = obj.b, r2 = _objectWithoutProperties(obj, [
        "a",
        "b"
    ]);
    var a3 = obj['a'], r3 = _objectWithoutProperties(obj, [
        'a'
    ]);
    var a4 = obj['a'], r4 = _objectWithoutProperties(obj, [
        'a'
    ]);
    var a5 = obj[a], r5 = _objectWithoutProperties(obj, [
        a
    ].map(_toPropertyKey));
}
var sa = Symbol();
var sb = Symbol();
function f2(obj) {
    var a1 = obj[sa], b1 = obj[sb], r1 = _objectWithoutProperties(obj, [
        sa,
        sb
    ].map(_toPropertyKey));
}
function f3(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = _objectWithoutProperties(obj, [
        k1,
        k2
    ].map(_toPropertyKey));
}
function f4(obj, k1, k2) {
    var a1 = obj[k1], a2 = obj[k2], r1 = _objectWithoutProperties(obj, [
        k1,
        k2
    ].map(_toPropertyKey));
}
