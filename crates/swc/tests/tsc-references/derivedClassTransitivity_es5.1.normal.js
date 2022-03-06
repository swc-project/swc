import * as swcHelpers from "@swc/helpers";
var C = // subclassing is not transitive when you can remove required parameters and add optional parameters
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    _proto.foo // ok to drop parameters
     = function foo() {};
    return D;
}(C);
var E = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
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
var r2 = e.foo('');
