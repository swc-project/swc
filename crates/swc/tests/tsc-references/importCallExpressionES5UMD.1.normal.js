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
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_class_call_check.mjs"), require("@swc/helpers/src/_interop_require_wildcard.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_class_call_check.mjs",
        "@swc/helpers/src/_interop_require_wildcard.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.1Ts = {}, global.classCallCheckMjs, global.interopRequireWildcardMjs);
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
        p2: function() {
            return p2;
        },
        D: function() {
            return D;
        }
    });
    _class_call_check = _class_call_check.default;
    _interop_require_wildcard = _interop_require_wildcard.default;
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
            _class_call_check(this, C);
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
            _class_call_check(this, D);
        }
        var _proto = D.prototype;
        _proto.method = function method() {
            var loadAsync = import("./0");
        };
        return D;
    }();
});
