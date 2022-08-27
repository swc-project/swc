//// [genericClassWithFunctionTypedMemberArguments.ts]
var ImmediatelyFix, WithCandidates;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(ImmediatelyFix) {
    var c = new (function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        return C.prototype.foo = function(x) {
            return x(null);
        }, C;
    }())();
    c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    }), c.foo(function(x) {
        return "";
    });
    var c2 = new (function() {
        "use strict";
        function C2() {
            _class_call_check(this, C2);
        }
        return C2.prototype.foo = function(x) {
            return x(null);
        }, C2;
    }())();
    c2.foo(function(x) {
        return 1;
    }), c2.foo(function(x) {
        return 1;
    });
}(ImmediatelyFix || (ImmediatelyFix = {})), function(WithCandidates) {
    var c, c2;
    c.foo2(1, function(a) {
        return "";
    }), c.foo2(1, function(a) {
        return "";
    }), c.foo2("", function(a) {
        return 1;
    }), c2.foo3(1, function(a) {
        return "";
    }, ""), c2.foo3(1, function(a) {
        return "";
    }, "");
}(WithCandidates || (WithCandidates = {}));
