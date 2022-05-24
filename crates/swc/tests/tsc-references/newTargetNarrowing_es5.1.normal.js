import _instanceof from "@swc/helpers/lib/_instanceof.js";
// @target: es6
// @strict: true
function foo(x) {}
function f() {
    if ((_instanceof(this, f) ? this.constructor : void 0).marked === true) {
        foo((_instanceof(this, f) ? this.constructor : void 0).marked);
    }
}
f.marked = true;
