//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    function foo() {
        return "foo";
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "foo", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    });
});
//// [1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _class_call_check, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        p2: function() {
            return p2;
        },
        D: function() {
            return D;
        }
    }), new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard._(m));
        }, reject);
    }), new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard._(m));
        }, reject);
    }).then(function(zero) {
        return zero.foo();
    });
    var p2 = new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard._(m));
        }, reject);
    }), D = function() {
        "use strict";
        function D() {
            _class_call_check._(this, D);
        }
        return D.prototype.method = function() {
            new Promise(function(resolve, reject) {
                return require([
                    "./0"
                ], function(m) {
                    return resolve(_interop_require_wildcard._(m));
                }, reject);
            });
        }, D;
    }();
});
