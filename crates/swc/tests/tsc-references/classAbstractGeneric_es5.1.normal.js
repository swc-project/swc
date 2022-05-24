import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error -- inherits abstract methods
(A);
var D = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(D, A);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
} // error -- inherits abstract methods
(A);
var E = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        return _super.apply(this, arguments);
    }
    var _proto = E.prototype;
    _proto.foo = function foo() {
        return this.t;
    };
    return E;
}(A);
var F = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(F, A);
    var _super = _create_super(F);
    function F() {
        _class_call_check(this, F);
        return _super.apply(this, arguments);
    }
    var _proto = F.prototype;
    _proto.bar = function bar(t) {};
    return F;
}(A);
var G = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(G, A);
    var _super = _create_super(G);
    function G() {
        _class_call_check(this, G);
        return _super.apply(this, arguments);
    }
    var _proto = G.prototype;
    _proto.foo = function foo() {
        return this.t;
    };
    _proto.bar = function bar(t) {};
    return G;
}(A);
