//// [mergedInterfacesWithInheritedPrivates.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
var a;
var r = a.x; // error
