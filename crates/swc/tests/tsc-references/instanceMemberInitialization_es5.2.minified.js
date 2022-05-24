import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    _class_call_check(this, C), this.x = 1;
}, c = new C();
c.x = 3;
var c2 = new C();
c.x, c2.x;
var MyMap = function(Map_) {
    "use strict";
    _class_call_check(this, MyMap), this.Map_ = Map_, this.store = new this.Map_();
};
