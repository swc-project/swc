function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _throw(e) {
    throw e;
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
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// @target: es5,es2015
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/39205
var trace = [];
var order = function(n) {
    return trace.push(n);
};
// order(0) should evaluate before order(1) because the first element is undefined
var ref = [], tmp = ref[0], ref1 = tmp === void 0 ? order(0) : tmp, x = ref1[order(1)];
// order(0) should not evaluate because the first element is defined
var tmp1 = {}, ref2 = tmp1 === void 0 ? order(0) : tmp1, y = ref2[order(1)];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
var _ref = {}, key = order(0), key1 = order(2), tmp2 = _ref[key], ref3 = tmp2 === void 0 ? order(1) : tmp2, z = ref3[key1], w = _objectWithoutProperties(_ref, [
    key
].map(_toPropertyKey));
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
var _ref1 = [
    {
        x: 1
    }
], __ref = _slicedToArray(_ref1, 2), ref4 = __ref[0], ref4 = ref4 !== null ? ref4 : _throw(new TypeError("Cannot destructure undefined")), tmp3 = __ref[1], b = tmp3 === void 0 ? a : tmp3, a = _extends({}, _ref1[0]);
