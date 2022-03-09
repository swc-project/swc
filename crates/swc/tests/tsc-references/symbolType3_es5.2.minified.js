import * as swcHelpers from "@swc/helpers";
var s = Symbol();
delete Symbol.iterator, swcHelpers.typeOf(Symbol.toStringTag), ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();
