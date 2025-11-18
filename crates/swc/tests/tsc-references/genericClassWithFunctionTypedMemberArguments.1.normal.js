//// [genericClassWithFunctionTypedMemberArguments.ts]
// Generic functions used as arguments for function typed parameters are not used to make inferences from
// Using function arguments, no errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(ImmediatelyFix) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        _proto.foo = function foo(x) {
            return x(null);
        };
        return C;
    }();
    var c = new C();
    var r = c.foo(function(x) {
        return '';
    }); // {}
    var r2 = c.foo(function(x) {
        return '';
    }); // string 
    var r3 = c.foo(function(x) {
        return '';
    }); // {}
    var C2 = /*#__PURE__*/ function() {
        "use strict";
        function C2() {
            _class_call_check(this, C2);
        }
        var _proto = C2.prototype;
        _proto.foo = function foo(x) {
            return x(null);
        };
        return C2;
    }();
    var c2 = new C2();
    var ra = c2.foo(function(x) {
        return 1;
    }); // number
    var r3a = c2.foo(function(x) {
        return 1;
    }); // number
})(ImmediatelyFix || (ImmediatelyFix = {}));
(function(WithCandidates) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        _proto.foo2 = function foo2(x, cb) {
            return cb(x);
        };
        return C;
    }();
    var c;
    var r4 = c.foo2(1, function(a) {
        return '';
    }); // string, contextual signature instantiation is applied to generic functions
    var r5 = c.foo2(1, function(a) {
        return '';
    }); // string
    var r6 = c.foo2('', function(a) {
        return 1;
    }); // number
    var C2 = /*#__PURE__*/ function() {
        "use strict";
        function C2() {
            _class_call_check(this, C2);
        }
        var _proto = C2.prototype;
        _proto.foo3 = function foo3(x, cb, y) {
            return cb(x);
        };
        return C2;
    }();
    var c2;
    var r7 = c2.foo3(1, function(a) {
        return '';
    }, ''); // string
    var r8 = c2.foo3(1, function(a) {
        return '';
    }, ''); // string
    var C3 = /*#__PURE__*/ function() {
        "use strict";
        function C3() {
            _class_call_check(this, C3);
        }
        var _proto = C3.prototype;
        _proto.foo3 = function foo3(x, cb, y) {
            return cb(x);
        };
        return C3;
    }();
    var c3;
    function other(t, u) {
        var r10 = c.foo2(1, function(x) {
            return '';
        }); // error
        var r10 = c.foo2(1, function(x) {
            return '';
        }); // string
        var r11 = c3.foo3(1, function(x) {
            return '';
        }, ''); // error
        var r11b = c3.foo3(1, function(x) {
            return '';
        }, 1); // error
        var r12 = c3.foo3(1, function(a) {
            return '';
        }, 1); // error
    }
})(WithCandidates || (WithCandidates = {}));
var ImmediatelyFix, WithCandidates;
