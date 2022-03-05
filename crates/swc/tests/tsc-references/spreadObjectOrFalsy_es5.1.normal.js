import * as swcHelpers from "@swc/helpers";
// @strict: true
// @declaration: true
function f1(a) {
    return swcHelpers.objectSpread({}, a); // Error
}
function f2(a) {
    return swcHelpers.objectSpread({}, a);
}
function f3(a) {
    return swcHelpers.objectSpread({}, a); // Error
}
function f4(a) {
    return swcHelpers.objectSpread({}, a);
}
function f5(a) {
    return swcHelpers.objectSpread({}, a);
}
function f6(a) {
    return swcHelpers.objectSpread({}, a);
}
// Repro from #46976
function g1(a) {
    var z = a.z;
    return swcHelpers.objectSpread({}, z);
}
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }
    swcHelpers.createClass(Foo, [
        {
            key: "bar",
            value: function bar() {
                if (this.hasData()) {
                    this.data.toLocaleLowerCase();
                }
            }
        },
        {
            key: "hasData",
            value: function hasData() {
                return true;
            }
        }
    ]);
    return Foo;
}();
