function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Base = function Base(a) {
    "use strict";
    _classCallCheck(this, Base);
};
var Generic = function Generic() {
    "use strict";
    _classCallCheck(this, Generic);
};
var Derived = function Derived(host) {
    "use strict";
    _classCallCheck(this, Derived);
    this.host = host;
    var self = this;
    this.n = 12;
};
