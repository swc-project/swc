import * as swcHelpers from "@swc/helpers";
var _name = new WeakMap(), Foo = function() {
    "use strict";
    function Foo(name) {
        swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _name, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _name, name);
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "getValue",
            value: function(x) {
                var _y = new WeakMap(), tmp = swcHelpers.classPrivateFieldGet(this, _name), Bar = function() {
                    function Bar() {
                        swcHelpers.classCallCheck(this, Bar), swcHelpers.classPrivateFieldInit(this, _y, {
                            writable: !0,
                            value: 100
                        });
                    }
                    return swcHelpers.createClass(Bar, [
                        {
                            key: tmp,
                            value: function() {
                                return x + swcHelpers.classPrivateFieldGet(this, _y);
                            }
                        }
                    ]), Bar;
                }();
                return new Bar()[swcHelpers.classPrivateFieldGet(this, _name)]();
            }
        }
    ]), Foo;
}();
console.log(new Foo("NAME").getValue(100));
