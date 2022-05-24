import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
function foo(func) {}
foo(function() {
    return !0;
}), foo(function() {
    return !1;
});
