import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
function foo(func) {}
foo(function() {
    return !0;
}), foo(function() {
    return !1;
});
