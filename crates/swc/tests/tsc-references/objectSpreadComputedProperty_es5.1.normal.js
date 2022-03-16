import * as swcHelpers from "@swc/helpers";
// fixes #12200
function f() {
    var n = 12;
    var m = 13;
    var a = null;
    var o1 = swcHelpers.objectSpread({}, {}, swcHelpers.defineProperty({}, n, n));
    var o2 = swcHelpers.objectSpread({}, {}, swcHelpers.defineProperty({}, a, n));
    var o3 = swcHelpers.objectSpread(swcHelpers.defineProperty({}, a, n), {}, swcHelpers.defineProperty({}, n, n), {}, swcHelpers.defineProperty({}, m, m));
}
