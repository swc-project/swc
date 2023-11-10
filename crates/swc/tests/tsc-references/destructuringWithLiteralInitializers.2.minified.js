//// [destructuringWithLiteralInitializers.ts]
var param, param1, param2, param3, param4, param5, param6, _param, _param1;
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function f4() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0,
        y: 0
    };
    _ref.x, _ref.y;
}
function f5() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0
    };
    _ref.x, _ref.y;
}
function f6() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    _ref.x, _ref.y;
}
function f7() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        a: {}
    }, _ref_a = _ref.a;
    _ref_a.x, _ref_a.y;
}
function g3() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0,
        0
    ], 2);
    _ref[0], _ref[1];
}
function g4() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0
    ], 2);
    _ref[0], _ref[1];
}
function g5() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], 2);
    _ref[0], _ref[1];
}
(param = {
    x: 1,
    y: 1
}).x, param.y, (param1 = {
    x: 1
}).x, param1.y, (param2 = {
    x: 1,
    y: 1
}).x, param2.y, (param3 = {}).x, param3.y, (param4 = {
    x: 1
}).x, param4.y, (param5 = {
    y: 1
}).x, param5.y, (param6 = {
    x: 1,
    y: 1
}).x, param6.y, f4(), f4({
    x: 1,
    y: 1
}), f5(), f5({
    x: 1
}), f5({
    x: 1,
    y: 1
}), f6(), f6({}), f6({
    x: 1
}), f6({
    y: 1
}), f6({
    x: 1,
    y: 1
}), f7(), f7({
    a: {}
}), f7({
    a: {
        x: 1
    }
}), f7({
    a: {
        y: 1
    }
}), f7({
    a: {
        x: 1,
        y: 1
    }
}), (_param = _sliced_to_array([
    1,
    1
], 2))[0], _param[1], (_param1 = _sliced_to_array([
    1,
    1
], 2))[0], _param1[1], g3(), g3([
    1,
    1
]), g4(), g4([
    1,
    1
]), g5(), g5([
    1,
    1
]);
