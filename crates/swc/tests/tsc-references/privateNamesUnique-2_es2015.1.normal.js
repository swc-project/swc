import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @filename: a.ts
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
var _x1 = /*#__PURE__*/ new WeakMap();
// @filename: b.ts
export class Foo {
    constructor(){
        _class_private_field_init(this, _x1, {
            writable: true,
            value: void 0
        });
    }
}
const a = new A();
const b = new B();
a.copy(b); // error
