import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.x = 1;
};
var c = new C();
c.x = 3;
var c2 = new C();
var r = c.x === c2.x;
var MyMap = function MyMap(Map_) {
    "use strict";
    swcHelpers.classCallCheck(this, MyMap);
    this.Map_ = Map_;
    this.store = new this.Map_();
};
