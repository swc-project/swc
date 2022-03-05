import * as swcHelpers from "@swc/helpers";
let a = 1, b = 2;
try {} catch (_param) {
    var { a: a1  } = _param, b1 = swcHelpers.objectWithoutProperties(_param, [
        "a"
    ]);
}
