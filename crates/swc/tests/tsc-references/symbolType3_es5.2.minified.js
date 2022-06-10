import _type_of from "@swc/helpers/lib/_type_of.js";
var s = Symbol();
delete Symbol.iterator, _type_of(Symbol.toStringTag), ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();
