//// [0.ts]
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
//// [1.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    p2: function() {
        return p2;
    },
    D: function() {
        return D;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(function() {
    return _interopRequireWildcard(require("./0"));
});
var p1 = Promise.resolve().then(function() {
    return _interopRequireWildcard(require("./0"));
});
p1.then(function(zero) {
    return zero.foo();
});
var p2 = Promise.resolve().then(function() {
    return _interopRequireWildcard(require("./0"));
});
function foo() {
    Promise.resolve().then(function() {
        return _interopRequireWildcard(require("./0"));
    });
}
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return C.prototype.method = function() {
        Promise.resolve().then(function() {
            return _interopRequireWildcard(require("./0"));
        });
    }, C;
}(), D = function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    return D.prototype.method = function() {
        Promise.resolve().then(function() {
            return _interopRequireWildcard(require("./0"));
        });
    }, D;
}();
