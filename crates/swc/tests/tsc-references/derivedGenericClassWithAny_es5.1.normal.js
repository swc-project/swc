import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "X",
            get: function get() {
                return null;
            }
        },
        {
            key: "foo",
            value: function foo() {
                return null;
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
    swcHelpers.createClass(D, [
        {
            key: "X",
            get: function get() {
                return null;
            }
        },
        {
            key: "foo",
            value: function foo() {
                return 1;
            }
        }
    ], [
        {
            key: "Y",
            get: function get() {
                return null;
            }
        },
        {
            key: "bar",
            value: function bar() {
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
    swcHelpers.createClass(E, [
        {
            key: "X",
            get: function get() {
                return '';
            } // error
        },
        {
            key: "foo",
            value: function foo() {
                return ''; // error
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
