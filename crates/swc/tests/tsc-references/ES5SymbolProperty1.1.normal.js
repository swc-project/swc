//// [ES5SymbolProperty1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var Symbol;
var obj = _define_property({}, Symbol.foo, 0);
obj[Symbol.foo];
