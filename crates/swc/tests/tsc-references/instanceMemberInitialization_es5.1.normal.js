import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this.x = 1;
};
var c = new C();
c.x = 3;
var c2 = new C();
var r = c.x === c2.x;
// #31792
var MyMap = function MyMap(Map_) {
    "use strict";
    _class_call_check(this, MyMap);
    this.Map_ = Map_;
    this.store = new this.Map_();
};
