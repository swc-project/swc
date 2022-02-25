function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
// @target: es6
// @strict: true
function foo(x) {}
function f() {
    if ((_instanceof(this, f) ? this.constructor : void 0).marked === true) {
        foo((_instanceof(this, f) ? this.constructor : void 0).marked);
    }
}
f.marked = true;
