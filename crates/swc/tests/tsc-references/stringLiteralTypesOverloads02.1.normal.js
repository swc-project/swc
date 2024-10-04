//// [stringLiteralTypesOverloads02.ts]
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
(function(Consts1) {
    var EMPTY_STRING = getFalsyPrimitive("string");
    var ZERO = getFalsyPrimitive('number');
    var FALSE = getFalsyPrimitive("boolean");
})(Consts1 || (Consts1 = {}));
var string = "string";
var number = "number";
var boolean = "boolean";
var stringOrNumber = string || number;
var stringOrBoolean = string || boolean;
var booleanOrNumber = number || boolean;
var stringOrBooleanOrNumber = stringOrBoolean || number;
(function(Consts2) {
    var EMPTY_STRING = getFalsyPrimitive(string);
    var ZERO = getFalsyPrimitive(number);
    var FALSE = getFalsyPrimitive(boolean);
    var a = getFalsyPrimitive(stringOrNumber);
    var b = getFalsyPrimitive(stringOrBoolean);
    var c = getFalsyPrimitive(booleanOrNumber);
    var d = getFalsyPrimitive(stringOrBooleanOrNumber);
})(Consts2 || (Consts2 = {}));
var Consts1, Consts2;
