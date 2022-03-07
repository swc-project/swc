import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    C.bar = function bar() {
        return 1;
    };
    swcHelpers.createClass(C, [
        {
            key: "X",
            get: function get() {
                return 1;
            }
        }
    ], [
        {
            key: "Y",
            get: function get() {
                return 1;
            }
        }
    ]);
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
    _proto.foo = function foo() {
        return 1;
    };
    D.bar = function bar() {
        return null;
    };
    swcHelpers.createClass(D, [
        {
            key: "X",
            get: function get() {
                return null;
            }
        }
    ], [
        {
            key: "Y",
            get: function get() {
                return null;
            }
        }
    ]);
    return D;
}(C);
var E = // if D is a valid class definition than E is now not safe tranisitively through C
/*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    var _proto = E.prototype;
    _proto.foo = function foo() {
        return '';
    };
    E.bar = function bar() {
        return '';
    };
    swcHelpers.createClass(E, [
        {
            key: "X",
            get: function get() {
                return '';
            }
        }
    ], [
        {
            key: "Y",
            get: function get() {
                return '';
            }
        }
    ]);
    return E;
}(D);
var c;
var d;
var e;
c = d;
c = e;
var r = c.foo(); // e.foo would return string
