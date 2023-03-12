//// [parserES5SymbolProperty6.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var prop;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this[prop] = "";
};
(function() {
    prop = Symbol.toStringTag;
})();
