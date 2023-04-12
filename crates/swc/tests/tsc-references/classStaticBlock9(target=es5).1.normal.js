//// [classStaticBlock9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
(function() {
    A.bar = A.foo + 1;
})();
(function() {
    A.foo + 2;
})();
(function() {
    A.foo = 1;
})();
