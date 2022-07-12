// @target: es6
// @strict: true
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
function foo(x) {}
function f() {
    if ((_instanceof(this, f) ? this.constructor : void 0).marked === true) {
        foo((_instanceof(this, f) ? this.constructor : void 0).marked);
    }
}
f.marked = true;
