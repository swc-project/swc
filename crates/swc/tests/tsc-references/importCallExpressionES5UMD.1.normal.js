//// [0.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.0Ts = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: function() {
            return foo;
        }
    });
    function foo() {
        return "foo";
    }
});
//// [1.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_class_call_check"), require("@swc/helpers/_/_interop_require_wildcard"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_class_call_check",
        "@swc/helpers/_/_interop_require_wildcard"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {}, global.classCallCheck, global.interopRequireWildcard);
})(this, function(exports, _class_call_check, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        D: function() {
            return D;
        },
        p2: function() {
            return p2;
        }
    });
    import("./0");
    var p1 = import("./0");
    p1.then(function(zero) {
        return zero.foo();
    });
    var p2 = import("./0");
    function foo() {
        var p2 = import("./0");
    }
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check._(this, C);
        }
        var _proto = C.prototype;
        _proto.method = function method() {
            var loadAsync = import("./0");
        };
        return C;
    }();
    var D = /*#__PURE__*/ function() {
        "use strict";
        function D() {
            _class_call_check._(this, D);
        }
        var _proto = D.prototype;
        _proto.method = function method() {
            var loadAsync = import("./0");
        };
        return D;
    }();
});
