import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export class Foo {
    copy(other) {
        _class_private_field_get(other, _x);
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
export class Foo {
    constructor(){
        _class_private_field_init(this, _x1, {
            writable: !0,
            value: void 0
        });
    }
}
let a = new A(), b = new B();
a.copy(b);
