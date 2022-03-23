import * as swcHelpers from "@swc/helpers";
function f() {
    (swcHelpers._instanceof(this, f) ? this.constructor : void 0).marked;
}
f.marked = !0;
