import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "thing",
            value: function thing() {}
        }
    ], [
        {
            key: "other",
            value: function other() {}
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
    return D;
}(C);
var d;
var r = d.foo;
var r2 = d.bar;
var r3 = d.thing();
var r4 = D.other();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            key: "thing",
            value: function thing(x) {}
        }
    ], [
        {
            key: "other",
            value: function other(x) {}
        }
    ]);
    return C2;
}();
var D2 = /*#__PURE__*/ function(C2) {
    "use strict";
    swcHelpers.inherits(D2, C2);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(C2);
var d2;
var r5 = d2.foo;
var r6 = d2.bar;
var r7 = d2.thing('');
var r8 = D2.other(1);
