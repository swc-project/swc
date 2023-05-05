//// [literalTypesWidenInParameterPosition.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var D = function D() {
    "use strict";
    var widen = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
    _class_call_check(this, D);
    this.widen = widen;
    this.noWiden = 1;
    this.noWiden = 5; // error
    this.widen = 6; // ok
};
new D(7); // ok
