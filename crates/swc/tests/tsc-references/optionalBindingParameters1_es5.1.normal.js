import * as swcHelpers from "@swc/helpers";
function foo(param) {
    var _param = swcHelpers.slicedToArray(param, 3), x = _param[0], y = _param[1], z = _param[2];
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
