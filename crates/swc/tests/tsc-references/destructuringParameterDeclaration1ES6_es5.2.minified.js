import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function a1(param) {
    var _param = _sliced_to_array(param, 3), ref = (_param[0], _param[1], _sliced_to_array(_param[2], 1)), ref1 = _sliced_to_array(ref[0], 1);
    ref1[0];
}
function b2() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function c0(param) {
    var _z = param.z;
    _z.x, _z.y.j;
}
function c1() {
    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        z: 10
    }).z;
}
function c2(param) {
    param.z;
}
function c5(param) {
    var _param = _sliced_to_array(param, 3), ref = (_param[0], _param[1], _sliced_to_array(_param[2], 1)), ref1 = _sliced_to_array(ref[0], 1);
    ref1[0];
}
a1([
    1,
    2,
    [
        [
            "world"
        ]
    ]
]), a1([
    1,
    2,
    [
        [
            "world"
        ]
    ],
    3
]), function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}([
    1,
    2,
    3
]), b2("string", {
    x: 200,
    y: "string"
}), b2("string", {
    x: 200,
    y: !0
}), function(Foo) {
    Foo[Foo.a = 0] = "a";
}(Foo || (Foo = {})), c0({
    z: {
        x: 1,
        y: {
            j: "world"
        }
    }
}), c0({
    z: {
        x: "string",
        y: {
            j: !0
        }
    }
}), c1(), c1({
    z: 1
}), c2({}), c2({
    z: 1
}), function() {
    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        b: "hello"
    }).b;
}({
    b: 1
}), c5([
    1,
    2,
    [
        [
            "string"
        ]
    ]
]), c5([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]);
var Foo, C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    return _proto.d3 = function() {}, _proto.d4 = function() {}, _proto.e0 = function(param) {
        var _param = _sliced_to_array(param, 3);
        _param[0], _param[1], _param[2];
    }, C2;
}(), C3 = function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3);
    }
    var _proto = C3.prototype;
    return _proto.d3 = function(param) {
        var _param = _sliced_to_array(param, 3);
        _param[0], _param[1], _param[2];
    }, _proto.d4 = function(param) {
        param.x, param.y, param.z;
    }, _proto.e0 = function(param) {
        var _param = _sliced_to_array(param, 3);
        _param[0], _param[1], _param[2];
    }, C3;
}();
!function() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 1,
        y: 2
    };
    ref.x, ref.y;
}();
