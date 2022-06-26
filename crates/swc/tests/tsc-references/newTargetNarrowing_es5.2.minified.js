import _instanceof from "@swc/helpers/src/_instanceof.mjs";
function f() {
    !0 === (_instanceof(this, f) ? this.constructor : void 0).marked && (_instanceof(this, f) ? this.constructor : void 0).marked;
}
f.marked = !0;
