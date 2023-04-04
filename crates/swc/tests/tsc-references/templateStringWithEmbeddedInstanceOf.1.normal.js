//// [templateStringWithEmbeddedInstanceOf.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var x = "abc".concat(_instanceof("hello", String), "def");
