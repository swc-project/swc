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
const a = 'a';
function f1(obj) {
    let r0 = _extends({
    }, obj);
    let { a: a1  } = obj, r1 = _objectWithoutProperties(obj, [
        "a"
    ]);
    let { a: a2 , b: b2  } = obj, r2 = _objectWithoutProperties(obj, [
        "a",
        "b"
    ]);
    let { 'a': a3  } = obj, r3 = _objectWithoutProperties(obj, [
        'a'
    ]);
    let { ['a']: a4  } = obj, r4 = _objectWithoutProperties(obj, [
        'a'
    ]);
    let { [a]: a5  } = obj, r5 = _objectWithoutProperties(obj, [
        a
    ].map(_toPropertyKey));
}
const sa = Symbol();
const sb = Symbol();
function f2(obj) {
    let { [sa]: a1 , [sb]: b1  } = obj, r1 = _objectWithoutProperties(obj, [
        sa,
        sb
    ].map(_toPropertyKey));
}
function f3(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = _objectWithoutProperties(obj, [
        k1,
        k2
    ].map(_toPropertyKey));
}
function f4(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = _objectWithoutProperties(obj, [
        k1,
        k2
    ].map(_toPropertyKey));
}
