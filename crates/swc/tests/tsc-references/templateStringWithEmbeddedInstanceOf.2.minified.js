//// [templateStringWithEmbeddedInstanceOf.ts]
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
"abc".concat(_instanceof("hello", String), "def");
