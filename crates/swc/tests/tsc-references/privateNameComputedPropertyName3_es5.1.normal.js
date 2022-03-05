import * as swcHelpers from "@swc/helpers";
var _name = new WeakMap();
var Foo = // @target: esnext, es2022, es2015
/*#__PURE__*/ function() {
    "use strict";
    function Foo(name) {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _name, name);
    }
    swcHelpers.createClass(Foo, [
        {
            key: "getValue",
            value: function getValue(x) {
                var obj = this;
                var _y = new WeakMap();
                var tmp = swcHelpers.classPrivateFieldGet(obj, _name);
                var Bar = /*#__PURE__*/ function() {
                    function Bar() {
                        swcHelpers.classCallCheck(this, Bar);
                        swcHelpers.classPrivateFieldInit(this, _y, {
                            writable: true,
                            value: 100
                        });
                    }
                    swcHelpers.createClass(Bar, [
                        {
                            key: tmp,
                            value: function value() {
                                return x + swcHelpers.classPrivateFieldGet(this, _y);
                            }
                        }
                    ]);
                    return Bar;
                }();
                return new Bar()[swcHelpers.classPrivateFieldGet(obj, _name)]();
            }
        }
    ]);
    return Foo;
}();
console.log(new Foo("NAME").getValue(100));
