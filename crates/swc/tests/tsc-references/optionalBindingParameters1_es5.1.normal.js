import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
function foo(param) {
    var _param = _sliced_to_array(param, 3), x = _param[0], y = _param[1], z = _param[2];
}
foo([
    "",
    0,
    false
]);
foo([
    false,
    0,
    ""
]);
