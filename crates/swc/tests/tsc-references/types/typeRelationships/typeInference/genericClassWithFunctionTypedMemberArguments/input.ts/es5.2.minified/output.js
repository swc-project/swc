var ImmediatelyFix, WithCandidates;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
!function(ImmediatelyFix) {
    var C = function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        return _createClass(C, [
            {
                key: "foo",
                value: function(x) {
                    return x(null);
                }
            }
        ]), C;
    }(), c = new C();
    c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    });
    var C2 = function() {
        "use strict";
        function C2() {
            _classCallCheck(this, C2);
        }
        return _createClass(C2, [
            {
                key: "foo",
                value: function(x) {
                    return x(null);
                }
            }
        ]), C2;
    }(), c2 = new C2();
    c2.foo(function(x) {
        return 1;
    }), c2.foo(function(x) {
        return 1;
    });
}(ImmediatelyFix || (ImmediatelyFix = {
})), (function(WithCandidates) {
    var c, c2, C = function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        return _createClass(C, [
            {
                key: "foo2",
                value: function(x, cb) {
                    return cb(x);
                }
            }
        ]), C;
    }();
    c.foo2(1, function(a) {
        return "";
    }), c.foo2(1, function(a) {
        return "";
    }), c.foo2("", function(a) {
        return 1;
    });
    var C2 = function() {
        "use strict";
        function C2() {
            _classCallCheck(this, C2);
        }
        return _createClass(C2, [
            {
                key: "foo3",
                value: function(x, cb, y) {
                    return cb(x);
                }
            }
        ]), C2;
    }();
    c2.foo3(1, function(a) {
        return "";
    }, ""), c2.foo3(1, function(a) {
        return "";
    }, "");
    var C3 = function() {
        "use strict";
        function C3() {
            _classCallCheck(this, C3);
        }
        return _createClass(C3, [
            {
                key: "foo3",
                value: function(x, cb, y) {
                    return cb(x);
                }
            }
        ]), C3;
    }();
})(WithCandidates || (WithCandidates = {
}));
