//// [templateStringInInstanceOf.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
_instanceof("abc".concat(0, "def"), String);
