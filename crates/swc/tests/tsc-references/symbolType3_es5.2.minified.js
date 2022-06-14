import _type_of from "@swc/helpers/src/_type_of.mjs";
var s = Symbol();
delete Symbol.iterator, _type_of(Symbol.toStringTag), ++s, --s, Symbol(), Symbol(), Symbol(), Symbol(), Symbol();
