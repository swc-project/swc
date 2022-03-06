import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C), this.x = 1;
}, c = new C();
c.x = 3;
var c2 = new C();
c.x === c2.x;
var MyMap = function(Map_) {
    "use strict";
    swcHelpers.classCallCheck(this, MyMap), this.Map_ = Map_, this.store = new this.Map_();
};
