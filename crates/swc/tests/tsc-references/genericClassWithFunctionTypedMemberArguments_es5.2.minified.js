var ImmediatelyFix, WithCandidates;
import * as swcHelpers from "@swc/helpers";
!function(ImmediatelyFix) {
    var C = function() {
        function C() {
            swcHelpers.classCallCheck(this, C);
        }
        return C.prototype.foo = function(x) {
            return x(null);
        }, C;
    }(), c = new C();
    c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    });
    var C2 = function() {
        function C2() {
            swcHelpers.classCallCheck(this, C2);
        }
        return C2.prototype.foo = function(x) {
            return x(null);
        }, C2;
    }(), c2 = new C2();
    c2.foo(function(x) {
        return 1;
    }), c2.foo(function(x) {
        return 1;
    });
}(ImmediatelyFix || (ImmediatelyFix = {})), function(WithCandidates) {
    var c, c2, C = function() {
        function C() {
            swcHelpers.classCallCheck(this, C);
        }
        return C.prototype.foo2 = function(x, cb) {
            return cb(x);
        }, C;
    }();
    c.foo2(1, function(a) {
        return "";
    }), c.foo2(1, function(a) {
        return "";
    }), c.foo2("", function(a) {
        return 1;
    });
    var C2 = function() {
        function C2() {
            swcHelpers.classCallCheck(this, C2);
        }
        return C2.prototype.foo3 = function(x, cb, y) {
            return cb(x);
        }, C2;
    }();
    c2.foo3(1, function(a) {
        return "";
    }, ""), c2.foo3(1, function(a) {
        return "";
    }, "");
    var C3 = function() {
        function C3() {
            swcHelpers.classCallCheck(this, C3);
        }
        return C3.prototype.foo3 = function(x, cb, y) {
            return cb(x);
        }, C3;
    }();
}(WithCandidates || (WithCandidates = {}));
