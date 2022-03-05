import * as swcHelpers from "@swc/helpers";
// @strictNullChecks: true
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    var optionalUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
    // undefined
    var undefinedUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, undefinedNumber);
    var undefinedUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    var allUndefined = swcHelpers.objectSpread({}, undefinedString, undefinedNumber);
    var undefinedWithOptionalContinues = swcHelpers.objectSpread({}, definiteBoolean, undefinedString, optionalNumber);
}
var m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
var x = swcHelpers.objectSpread({}, m, {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = swcHelpers.objectSpread({}, fields, partialFields);
    // error: not optional, undefined remains
    fields = swcHelpers.objectSpread({}, fields, nearlyPartialFields);
}
