import * as swcHelpers from "@swc/helpers";
var a = 1, b = 2;
try {} catch (_param) {
    var a1 = _param.a, b1 = swcHelpers.objectWithoutProperties(_param, [
        "a"
    ]);
}
