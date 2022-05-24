import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// subclassing is not transitive when you can remove required parameters and add optional parameters on protected members
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    _proto.foo // ok to drop parameters
     = function foo() {};
    return D;
}(C);
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        return _super.apply(this, arguments);
    }
    var _proto = E.prototype;
    _proto.foo // ok to add optional parameters
     = function foo(x) {};
    return E;
}(D);
var c;
var d;
var e;
c = e;
var r = c.foo(1);
var r2 = e.foo("");
