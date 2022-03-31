import * as swcHelpers from "@swc/helpers";
function a1(param) {
    var _param = swcHelpers.slicedToArray(param, 3), ref = (_param[0], _param[1], swcHelpers.slicedToArray(_param[2], 1)), ref1 = swcHelpers.slicedToArray(ref[0], 1);
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
    var _param = swcHelpers.slicedToArray(param, 3), ref = (_param[0], _param[1], swcHelpers.slicedToArray(_param[2], 1)), ref2 = swcHelpers.slicedToArray(ref[0], 1);
    ref2[0];
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
}), function() {
    var ref = swcHelpers.slicedToArray(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        void 0,
        null,
        void 0
    ], 3);
    ref[0], ref[1], ref[2];
}([
    "string",
    1,
    2
]), function() {
    var ref = swcHelpers.slicedToArray(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        [
            void 0
        ],
        void 0,
        [
            [
                void 0,
                void 0
            ]
        ]
    ], 3), ref3 = (swcHelpers.slicedToArray(ref[0], 1)[0], ref[1], swcHelpers.slicedToArray(ref[2], 1)), ref4 = swcHelpers.slicedToArray(ref3[0], 2);
    ref4[0], ref4[1];
}([
    [
        "string"
    ],
    1,
    [
        [
            !0,
            !1
        ]
    ]
]), function(Foo) {
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
var C2 = function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    var _proto = C2.prototype;
    return _proto.d3 = function() {}, _proto.d4 = function() {}, _proto.e0 = function(param) {
        var _param = swcHelpers.slicedToArray(param, 3);
        _param[0], _param[1], _param[2];
    }, C2;
}(), C3 = function() {
    "use strict";
    function C3() {
        swcHelpers.classCallCheck(this, C3);
    }
    var _proto = C3.prototype;
    return _proto.d3 = function(param) {
        var _param = swcHelpers.slicedToArray(param, 3);
        _param[0], _param[1], _param[2];
    }, _proto.d4 = function(param) {
        param.x, param.y, param.z;
    }, _proto.e0 = function(param) {
        var _param = swcHelpers.slicedToArray(param, 3);
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
