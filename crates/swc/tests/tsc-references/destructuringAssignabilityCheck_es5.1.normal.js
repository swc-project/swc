import * as swcHelpers from "@swc/helpers";
// @strict: true
var ref = swcHelpers.slicedToArray({}, 0); // should be error
var undefined = undefined !== null ? undefined : swcHelpers._throw(new TypeError("Cannot destructure undefined")); // error correctly
(function(param) {
    var _param = swcHelpers.slicedToArray(param, 0);
    return 0;
})({}); // should be error
(function(param) {
    var param = param !== null ? param : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
    return 0;
})(undefined); // should be error
function foo(param) {
    var param = param !== null ? param : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
    return 0;
}
function bar(param) {
    var _param = swcHelpers.slicedToArray(param, 0);
    return 0;
}
var ref1 = 1, ref1 = ref1 !== null ? ref1 : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
var ref2 = swcHelpers.slicedToArray({}, 0);
