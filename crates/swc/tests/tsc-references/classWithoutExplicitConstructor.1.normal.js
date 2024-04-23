//// [classWithoutExplicitConstructor.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this.x = 1;
    this.y = 'hello';
};
var c = new C();
var c2 = new C(null); // error
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    this.x = 2;
    this.y = null;
};
var d = new D();
var d2 = new D(null); // error
