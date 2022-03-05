import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, null, [
        {
            key: "foo",
            value: function foo(x) {}
        },
        {
            key: "bar",
            value: function bar(x) {}
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
            key: "foo",
            value: function foo() {}
        }
    ], [
        {
            key: "baz",
            value: function baz(x) {}
        }
    ]);
    return D;
}(C);
var d;
var r1;
var r2;
