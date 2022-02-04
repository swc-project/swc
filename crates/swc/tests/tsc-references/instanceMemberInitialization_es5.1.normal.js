function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    this.x = 1;
};
var c = new C();
c.x = 3;
var c2 = new C();
var r = c.x === c2.x;
var MyMap = function MyMap(Map_) {
    "use strict";
    _classCallCheck(this, MyMap);
    this.Map_ = Map_;
    // #31792
    this.store = new this.Map_();
};
