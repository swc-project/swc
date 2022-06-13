var M;
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
function f14(param) {
    var _param = _sliced_to_array(param, 2), ref = (_param[0], _sliced_to_array(_param[1], 2)), ref1 = (ref[0], ref[1]);
    ref1.x, ref1.y;
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
]), function(M1) {
    M1.a = 1, M1.b = 2;
}(M || (M = {})), f17({}), f17({
    a: "hello"
}), f17({
    c: !0
}), f17({
    a: "hello",
    b: 1,
    c: !0
});
