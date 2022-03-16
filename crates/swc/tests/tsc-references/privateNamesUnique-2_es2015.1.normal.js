import * as swcHelpers from "@swc/helpers";
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = /*#__PURE__*/ new WeakMap();
// @target: es2015
// @filename: a.ts
export class Foo {
    copy(other) {
        swcHelpers.classPrivateFieldGet(other, _x); // error
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
var _x1 = /*#__PURE__*/ new WeakMap();
// @filename: b.ts
export class Foo {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x1, {
            writable: true,
            value: void 0
        });
    }
}
const a = new A();
const b = new B();
a.copy(b); // error
