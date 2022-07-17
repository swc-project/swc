// @declaration: true
function getFalsyPrimitive(x) {
    if (x === "string") {
        return "";
    }
    if (x === "number") {
        return 0;
    }
    if (x === "boolean") {
        return false;
    }
    // Should be unreachable.
    throw "Invalid value";
}
var Consts1;
(function(Consts1) {
    const EMPTY_STRING = getFalsyPrimitive("string");
    const ZERO = getFalsyPrimitive('number');
    const FALSE = getFalsyPrimitive("boolean");
})(Consts1 || (Consts1 = {}));
const string = "string";
const number = "number";
const boolean = "boolean";
const stringOrNumber = string || number;
const stringOrBoolean = string || boolean;
const booleanOrNumber = number || boolean;
const stringOrBooleanOrNumber = stringOrBoolean || number;
var Consts2;
(function(Consts2) {
    const EMPTY_STRING = getFalsyPrimitive(string);
    const ZERO = getFalsyPrimitive(number);
    const FALSE = getFalsyPrimitive(boolean);
    const a = getFalsyPrimitive(stringOrNumber);
    const b = getFalsyPrimitive(stringOrBoolean);
    const c = getFalsyPrimitive(booleanOrNumber);
    const d = getFalsyPrimitive(stringOrBooleanOrNumber);
})(Consts2 || (Consts2 = {}));
