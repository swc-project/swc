//// [superCallInConstructorWithNoBaseType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    super(); // error
};
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
    super(), this.x = x; // error
};
