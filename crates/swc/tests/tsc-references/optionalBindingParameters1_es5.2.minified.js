import * as swcHelpers from "@swc/helpers";
function foo(param) {
    var _param = swcHelpers.slicedToArray(param, 3);
    _param[0], _param[1], _param[2];
}
foo([
    "",
    0,
    !1
]), foo([
    !1,
    0,
    ""
]);
