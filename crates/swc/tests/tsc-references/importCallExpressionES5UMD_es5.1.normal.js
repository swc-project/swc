import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @module: umd
// @target: es5
// @lib: es6
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
import("./0");
var p1 = import("./0");
p1.then(function(zero) {
    return zero.foo();
});
export var p2 = import("./0");
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
export var D = /*#__PURE__*/ function() {
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
