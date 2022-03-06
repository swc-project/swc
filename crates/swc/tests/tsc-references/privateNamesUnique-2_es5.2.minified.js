import * as swcHelpers from "@swc/helpers";
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export var Foo = function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return swcHelpers.createClass(Foo, [
        {
            key: "copy",
            value: function(other) {
                swcHelpers.classPrivateFieldGet(other, _x);
            }
        }
    ]), Foo;
}();
var _x1 = new WeakMap();
export var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo), swcHelpers.classPrivateFieldInit(this, _x1, {
        writable: !0,
        value: void 0
    });
};
var a = new A(), b = new B();
a.copy(b);
