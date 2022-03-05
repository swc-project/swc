import * as swcHelpers from "@swc/helpers";
var B = // @noImplicitOverride: true
// @allowJs: true
// @noEmit: true
// @Filename: a.js
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    swcHelpers.createClass(B, [
        {
            key: "foo",
            value: function foo(v) {}
        },
        {
            key: "fooo",
            value: function fooo(v) {}
        }
    ]);
    return B;
}();
var D = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function foo(v) {}
        },
        {
            /** @override */ key: "fooo",
            value: function fooo(v) {}
        },
        {
            /** @override */ key: "bar",
            value: function bar(v) {}
        }
    ]);
    return D;
}(B);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {}
        },
        {
            /** @override */ key: "fooo",
            value: function fooo(v) {}
        },
        {
            /** @override */ key: "bar",
            value: function bar(v) {}
        }
    ]);
    return C;
}();
