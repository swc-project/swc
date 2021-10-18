function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function f1() {
    var f = function f() {
        var C = function C(x, y) {
            "use strict";
            _classCallCheck(this, C);
            this.x = x;
            this.y = y;
        };
        return C;
    };
    var C = f();
    var v = new C(10, 20);
    var x = v.x;
    var y = v.y;
}
function f2() {
    var f = function f(x) {
        var C = function C(y) {
            "use strict";
            _classCallCheck(this, C);
            this.y = y;
            this.x = x;
        };
        return C;
    };
    var C = f(10);
    var v = new C(20);
    var x = v.x;
    var y = v.y;
}
function f3() {
    var f = function f(x, y) {
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
            this.x = x;
            this.y = y;
        };
        return C;
    };
    var C = f(10, 20);
    var v = new C();
    var x = v.x;
    var y = v.y;
}
