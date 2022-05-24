import _instanceof from "@swc/helpers/lib/_instanceof.js";
function f() {
    !0 === (_instanceof(this, f) ? this.constructor : void 0).marked && (_instanceof(this, f) ? this.constructor : void 0).marked;
}
f.marked = !0;
