//// [declarationsAndAssignments.ts]
var M;
import "@swc/helpers/_/_object_destructuring_empty";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import "@swc/helpers/_/_to_array";
function f14(param) {
    var _param = _sliced_to_array(param, 2), _param_ = (_param[0], _sliced_to_array(_param[1], 2)), _param__ = (_param_[0], _param_[1]);
    _param__.x, _param__.y;
}
function f17(param) {
    param.a, param.b, param.c;
}
f14([
    2,
    [
        "abc",
        {
            x: 0,
            y: !0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            x: 0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            y: !1
        }
    ]
]), (M = {}).a = 1, M.b = 2, f17({}), f17({
    a: "hello"
}), f17({
    c: !0
}), f17({
    a: "hello",
    b: 1,
    c: !0
});
