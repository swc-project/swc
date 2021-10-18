function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    this.x = x;
};
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.x = x;
};
var E = function E(x) {
    "use strict";
    _classCallCheck(this, E);
    this.x = x;
};
var c = new C(1);
var d = new D(1); // error
var e = new E(1); // error
var Generic;
(function(Generic) {
    var C1 = function C1(x) {
        "use strict";
        _classCallCheck(this, C1);
        this.x = x;
    };
    var D1 = function D1(x) {
        "use strict";
        _classCallCheck(this, D1);
        this.x = x;
    };
    var E1 = function E1(x) {
        "use strict";
        _classCallCheck(this, E1);
        this.x = x;
    };
    var c = new C1(1);
    var d = new D1(1); // error
    var e = new E1(1); // error
})(Generic || (Generic = {
}));
