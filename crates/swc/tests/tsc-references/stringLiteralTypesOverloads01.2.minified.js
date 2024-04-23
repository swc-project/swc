//// [stringLiteralTypesOverloads01.ts]
function getFalsyPrimitive(x) {
    if ("string" === x) return "";
    if ("number" === x) return 0;
    if ("boolean" === x) return !1;
    throw "Invalid value";
}
Consts1 || (Consts1 = {}), getFalsyPrimitive("string"), getFalsyPrimitive('number'), getFalsyPrimitive("boolean");
var Consts1, Consts2, string = "string", number = "number", boolean = "boolean", stringOrNumber = string || number, stringOrBoolean = string || boolean, booleanOrNumber = number || boolean, stringOrBooleanOrNumber = stringOrBoolean || number;
Consts2 || (Consts2 = {}), getFalsyPrimitive(string), getFalsyPrimitive(number), getFalsyPrimitive(boolean), getFalsyPrimitive(stringOrNumber), getFalsyPrimitive(stringOrBoolean), getFalsyPrimitive(booleanOrNumber), getFalsyPrimitive(stringOrBooleanOrNumber);
