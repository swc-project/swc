import * as swcHelpers from "@swc/helpers";
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export var Foo = function() {
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return Foo.prototype.copy = function(other) {
        swcHelpers.classPrivateFieldGet(other, _x);
    }, Foo;
}();
var _x1 = new WeakMap();
export var Foo = function() {
    swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _x1, {
        writable: !0,
        value: void 0
    });
};
var a = new A(), b = new B();
a.copy(b);
