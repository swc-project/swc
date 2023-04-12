//// [thisInInstanceMemberInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this.x = this;
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    this.x = this;
};
