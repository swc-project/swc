import * as swcHelpers from "@swc/helpers";
var _bar = /*#__PURE__*/ new WeakMap(), _privateMethod = /*#__PURE__*/ new WeakSet();
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateMethodInit(this, _privateMethod);
        swcHelpers.classPrivateFieldInit(this, _bar, {
            writable: true,
            value: "i'm a private field!"
        });
    }
    swcHelpers.createClass(Foo, [
        {
            key: "foo",
            value: function foo() {
                return swcHelpers.classPrivateFieldGet(this, _bar);
            }
        },
        {
            key: "bar",
            value: function bar() {
                return swcHelpers.classPrivateMethodGet(this, _privateMethod, privateMethod).call(this);
            }
        }
    ]);
    return Foo;
}();
function privateMethod() {
    return "i'm a private method!";
}
var f = new Foo();
console.log(f.foo());
console.log(f.bar());
