import * as swcHelpers from "@swc/helpers";
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var S = function S() {
    "use strict";
    swcHelpers.classCallCheck(this, S);
};
var _c = {
    get: get_c,
    set: void 0
};
var _a = {
    writable: true,
    value: 1
};
function b() {
    swcHelpers.classStaticPrivateFieldSpecSet(this, S, _a, 42);
}
function get_c() {
    return swcHelpers.classStaticPrivateMethodGet(S, S, b).call(S);
}
