function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key2 in source){
                if (Object.prototype.hasOwnProperty.call(source, key2)) {
                    target[key2] = source[key2];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key2, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key2 = sourceSymbolKeys[i];
            if (excluded.indexOf(key2) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key2)) continue;
            target[key2] = source[key2];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key2, i;
    for(i = 0; i < sourceKeys.length; i++){
        key2 = sourceKeys[i];
        if (excluded.indexOf(key2) >= 0) continue;
        target[key2] = source[key2];
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
    var key2 = _toPrimitive(arg, "string");
    return _typeof(key2) === "symbol" ? key2 : String(key2);
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @target: es5,es2015
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/39205
let trace = [];
let order = (n)=>trace.push(n)
;
// order(0) should evaluate before order(1) because the first element is undefined
let [{ [order(1)]: x  } = order(0)] = [];
// order(0) should not evaluate because the first element is defined
let [{ [order(1)]: y  } = order(0)] = [
    {}
];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
let _ref = {}, key = order(0), key1 = order(2), { [key]: { [key1]: z  } = order(1)  } = _ref, w = _objectWithoutProperties(_ref, [
    key
].map(_toPropertyKey));
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _ref1[0]);
