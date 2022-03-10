import * as swcHelpers from "@swc/helpers";
var _name = new WeakMap();
// @target: esnext, es2022, es2015
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo(name) {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _name, name);
    }
    var _proto1 = Foo.prototype;
    _proto1.getValue = function getValue(x) {
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
            var _proto = Bar.prototype;
            _proto[tmp] = function() {
                return x + swcHelpers.classPrivateFieldGet(this, _y);
            };
            return Bar;
        }();
        return new Bar()[swcHelpers.classPrivateFieldGet(obj, _name)]();
    };
    return Foo;
}();
console.log(new Foo("NAME").getValue(100));
