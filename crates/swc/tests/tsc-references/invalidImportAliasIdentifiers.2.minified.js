//// [invalidImportAliasIdentifiers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var E, V = 12, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
!function(E) {
    E[E.Red = 0] = "Red", E[E.Blue = 1] = "Blue";
}(E || (E = {}));
