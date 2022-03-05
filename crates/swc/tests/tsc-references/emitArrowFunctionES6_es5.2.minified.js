import * as swcHelpers from "@swc/helpers";
function foo(func) {}
foo(function() {
    return !0;
}), foo(function() {
    return !1;
});
