import * as swcHelpers from "@swc/helpers";
// @target: es6
// @strict: true
function foo(x) {}
function f() {
    if ((swcHelpers._instanceof(this, f) ? this.constructor : void 0).marked === true) {
        foo((swcHelpers._instanceof(this, f) ? this.constructor : void 0).marked);
    }
}
f.marked = true;
