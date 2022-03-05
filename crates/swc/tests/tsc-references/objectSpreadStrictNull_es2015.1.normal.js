import * as swcHelpers from "@swc/helpers";
// @strictNullChecks: true
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    let optionalUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalNumber);
    let optionalUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    let allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
    // undefined
    let undefinedUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, undefinedNumber);
    let undefinedUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    let allUndefined = swcHelpers.objectSpread({}, undefinedString, undefinedNumber);
    let undefinedWithOptionalContinues = swcHelpers.objectSpread({}, definiteBoolean, undefinedString, optionalNumber);
}
const m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
const x = swcHelpers.objectSpread({}, m, {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = swcHelpers.objectSpread({}, fields, partialFields);
    // error: not optional, undefined remains
    fields = swcHelpers.objectSpread({}, fields, nearlyPartialFields);
}
