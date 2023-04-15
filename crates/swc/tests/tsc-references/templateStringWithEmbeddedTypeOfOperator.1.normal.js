//// [templateStringWithEmbeddedTypeOfOperator.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var x = "abc".concat(_type_of("hi"), "def");
