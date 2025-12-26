//// [a.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _x = /*#__PURE__*/ new WeakMap();
export class Foo {
    copy(other) {
        _class_private_field_get(other, _x); // error
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
//// [b.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _x = /*#__PURE__*/ new WeakMap();
export class Foo {
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
//// [main.ts]
import { Foo as A } from "./a";
import { Foo as B } from "./b";
const a = new A();
const b = new B();
a.copy(b); // error
