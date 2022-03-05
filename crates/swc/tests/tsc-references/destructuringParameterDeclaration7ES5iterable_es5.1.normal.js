import * as swcHelpers from "@swc/helpers";
function foo(_$param, param) {
    var _$param = _$param !== null ? _$param : swcHelpers._throw(new TypeError("Cannot destructure undefined")), foo = param.foo, bar = param.bar;
}
function baz(param, param1) {
    var _param = swcHelpers.slicedToArray(param, 0), foo = param1.foo, bar = param1.bar;
}
function one(param, _$param) {
    var _param = swcHelpers.slicedToArray(param, 0), _$param = _$param !== null ? _$param : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
}
function two(param, param2) {
    var _param = swcHelpers.slicedToArray(param, 0), _param1 = swcHelpers.slicedToArray(param2, 3), a = _param1[0], b = _param1[1], c = _param1[2];
}
