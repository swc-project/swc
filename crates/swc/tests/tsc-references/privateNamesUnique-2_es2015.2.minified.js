import * as swcHelpers from "@swc/helpers";
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
export class Foo {
    copy(other) {
        swcHelpers.classPrivateFieldGet(other, _x);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
export class Foo {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x1, {
            writable: !0,
            value: void 0
        });
    }
}
let a = new A(), b = new B();
a.copy(b);
