import * as swcHelpers from "@swc/helpers";
var D = // @target:es6
/*#__PURE__*/ function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function foo() {}
        },
        {
            key: "computedName1",
            value: function value() {}
        },
        {
            key: "computedName2",
            value: function value(a) {}
        },
        {
            key: "computedName3",
            value: function value(a) {
                return 1;
            }
        },
        {
            key: "bar",
            value: function bar() {
                return this._bar;
            }
        },
        {
            key: "baz",
            value: function baz(a, x) {
                return "HELLO";
            }
        }
    ], [
        {
            key: "computedname4",
            value: function value() {}
        },
        {
            key: "computedname5",
            value: function value(a) {}
        },
        {
            key: "computedname6",
            value: function value(a) {
                return true;
            }
        },
        {
            key: "staticMethod",
            value: function staticMethod() {
                var x = 1 + 2;
                return x;
            }
        },
        {
            key: "foo",
            value: function foo(a) {}
        },
        {
            key: "bar",
            value: function bar(a) {
                return 1;
            }
        }
    ]);
    return D;
}();
