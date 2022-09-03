//// [ES5SymbolProperty1.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
var Symbol, obj = _define_property({}, Symbol.foo, 0);
obj[Symbol.foo];
