//// [0.ts]
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
//// [1.ts]
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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve().then(function() {
    return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
});
var p1 = Promise.resolve().then(function() {
    return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
});
p1.then(function(zero) {
    return zero.foo();
});
var p2 = Promise.resolve().then(function() {
    return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
});
function foo() {
    var p2 = Promise.resolve().then(function() {
        return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
    });
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var loadAsync = Promise.resolve().then(function() {
            return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
        });
    };
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    var _proto = D.prototype;
    _proto.method = function method() {
        var loadAsync = Promise.resolve().then(function() {
            return /*#__PURE__*/ _interopRequireWildcard(require("./0"));
        });
    };
    return D;
}();
