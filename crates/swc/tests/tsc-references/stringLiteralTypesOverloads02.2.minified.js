//// [stringLiteralTypesOverloads02.ts]
function getFalsyPrimitive(x) {
    if ("string" === x) return "";
    if ("number" === x) return 0;
    if ("boolean" === x) return !1;
    throw "Invalid value";
}
getFalsyPrimitive("string"), getFalsyPrimitive('number'), getFalsyPrimitive("boolean");
var string = "string", number = "number", boolean = "boolean", stringOrNumber = string || number, stringOrBoolean = string || boolean, booleanOrNumber = number || boolean, stringOrBooleanOrNumber = stringOrBoolean || number;
getFalsyPrimitive(string), getFalsyPrimitive(number), getFalsyPrimitive(boolean), getFalsyPrimitive(stringOrNumber), getFalsyPrimitive(stringOrBoolean), getFalsyPrimitive(booleanOrNumber), getFalsyPrimitive(stringOrBooleanOrNumber);
