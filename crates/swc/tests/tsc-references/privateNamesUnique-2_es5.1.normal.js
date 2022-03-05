import * as swcHelpers from "@swc/helpers";
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
// @target: es2015
// @filename: a.ts
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        swcHelpers.classCallCheck(this, Foo);
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
    swcHelpers.createClass(Foo, [
        {
            key: "copy",
            value: function copy(other) {
                swcHelpers.classPrivateFieldGet(other, _x); // error
            }
        }
    ]);
    return Foo;
}();
var _x1 = new WeakMap();
// @filename: b.ts
export var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
    swcHelpers.classPrivateFieldInit(this, _x1, {
        writable: true,
        value: void 0
    });
};
var a = new A();
var b = new B();
a.copy(b); // error
