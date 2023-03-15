//// [objectSpreadStrictNull.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
function f(definiteBoolean, definiteString, optionalString, optionalNumber, undefinedString, undefinedNumber) {
    // optional
    var optionalUnionStops = _extends({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _extends({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _extends({}, optionalString, optionalNumber);
    // undefined
    var undefinedUnionStops = _extends({}, definiteBoolean, definiteString, undefinedNumber);
    var undefinedUnionDuplicates = _extends({}, definiteBoolean, definiteString, undefinedString, undefinedNumber);
    var allUndefined = _extends({}, undefinedString, undefinedNumber);
    var undefinedWithOptionalContinues = _extends({}, definiteBoolean, undefinedString, optionalNumber);
}
var m = {
    title: "The Matrix",
    yearReleased: 1999
};
// should error here because title: undefined is not assignable to string
var x = _object_spread_props(_extends({}, m), {
    title: undefined
});
function g(fields, partialFields, nearlyPartialFields) {
    // ok, undefined is stripped from optional properties when spread
    fields = _extends({}, fields, partialFields);
    // error: not optional, undefined remains
    fields = _extends({}, fields, nearlyPartialFields);
}
