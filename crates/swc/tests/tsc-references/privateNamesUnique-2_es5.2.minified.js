import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo), _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return Foo.prototype.copy = function(other) {
        _class_private_field_get(other, _x);
    }, Foo;
}();
var _x1 = new WeakMap();
export var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), _class_private_field_init(this, _x1, {
        writable: !0,
        value: void 0
    });
};
var a = new A(), b = new B();
a.copy(b);
