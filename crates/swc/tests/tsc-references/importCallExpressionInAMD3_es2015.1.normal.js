import * as swcHelpers from "@swc/helpers";
// @module: amd
// @target: esnext
// @filename: 0.ts
export class B {
    print() {
        return "I am B";
    }
}
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @filename: 2.ts
    swcHelpers.asyncToGenerator(function*() {
        class C extends (yield import("./0")).B {
        }
        var c = new C();
        c.print();
    });
    return _foo.apply(this, arguments);
}
foo();
