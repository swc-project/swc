//// [verbatimModuleSyntaxRestrictionsESM.ts]
//// [/decl.d.ts]
export { };
//// [/ambient.d.ts]
//// [/types.ts]
export { };
//// [/main.ts]
import CJSy3 from "./decl"; // ok in esModuleInterop
import * as types from "./types"; // ok
CJSy;
//// [/ns.ts]
(function(ns) {
    (function(A) {})(ns.A || (ns.A = {}));
})(ns || (ns = {}));
export var ns;
