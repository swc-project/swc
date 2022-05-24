import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @filename: a.ts
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
    var _proto = Foo.prototype;
    _proto.copy = function copy(other) {
        _class_private_field_get(other, _x); // error
    };
    return Foo;
}();
var _x1 = /*#__PURE__*/ new WeakMap();
// @filename: b.ts
export var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    _class_private_field_init(this, _x1, {
        writable: true,
        value: void 0
    });
};
var a = new A();
var b = new B();
a.copy(b); // error
