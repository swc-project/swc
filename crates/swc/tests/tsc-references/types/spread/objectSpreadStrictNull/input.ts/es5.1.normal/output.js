function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
// @strictNullChecks: true
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    var optionalUnionStops = _objectSpread({
    }, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _objectSpread({
    }, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _objectSpread({
    }, optionalString, optionalNumber);
    // undefined
    var undefinedUnionStops = _objectSpread({
    }, definiteBoolean, definiteString, undefinedNumber);
    var undefinedUnionDuplicates = _objectSpread({
    }, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    var allUndefined = _objectSpread({
    }, undefinedString, undefinedNumber);
    var undefinedWithOptionalContinues = _objectSpread({
    }, definiteBoolean, undefinedString, optionalNumber);
}
var m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
var x = _objectSpread({
}, m, {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = _objectSpread({
    }, fields, partialFields);
    // error: not optional, undefined remains
    fields = _objectSpread({
    }, fields, nearlyPartialFields);
}
