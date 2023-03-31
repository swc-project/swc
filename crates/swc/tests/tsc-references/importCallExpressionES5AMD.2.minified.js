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
    "@swc/helpers/src/_class_call_check.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
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
    }), _class_call_check = _class_call_check.default, _interop_require_wildcard = _interop_require_wildcard.default, new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard(m));
        }, reject);
    }), new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard(m));
        }, reject);
    }).then(function(zero) {
        return zero.foo();
    });
    var p2 = new Promise(function(resolve, reject) {
        return require([
            "./0"
        ], function(m) {
            return resolve(_interop_require_wildcard(m));
        }, reject);
    }), D = function() {
        "use strict";
        function D() {
            _class_call_check(this, D);
        }
        return D.prototype.method = function() {
            new Promise(function(resolve, reject) {
                return require([
                    "./0"
                ], function(m) {
                    return resolve(_interop_require_wildcard(m));
                }, reject);
            });
        }, D;
    }();
});
