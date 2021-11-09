function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _slicedToArray(arr, i) {
    return (function(arr) {
        if (Array.isArray(arr)) return arr;
    })(arr) || (function(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                _n || null == _i.return || _i.return();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    })(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    })();
}
function a1(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref1 = _slicedToArray(ref[0], 1);
    ref1[0];
}
function b2(param, param1) {
}
function c0(param) {
    var _z = param.z;
    _z.x, _z.y.j;
}
function c1(param) {
    (void 0 === param ? {
        z: 10
    } : param).z;
}
function c2(param) {
    param.z;
}
function c5(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref2 = _slicedToArray(ref[0], 1);
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
]), b2("string", {
    x: 200,
    y: "string"
}), b2("string", {
    x: 200,
    y: !0
}), (function(param) {
    var ref = _slicedToArray(void 0 === param ? [
        void 0,
        null,
        void 0
    ] : param, 3);
    ref[0], ref[1], ref[2];
})([
    "string",
    1,
    2
]), (function(param) {
    var ref = _slicedToArray(void 0 === param ? [
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
    ] : param, 3), a = _slicedToArray(ref[0], 1)[0], b = ref[1], ref3 = _slicedToArray(ref[2], 1), ref4 = _slicedToArray(ref3[0], 2);
    ref4[0], ref4[1];
})([
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
]), (Foo = Foo1 || (Foo1 = {
}))[Foo.a = 0] = "a", c0({
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
}), c2({
}), c2({
    z: 1
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
var Foo, Foo1, C2 = function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, [
        {
            key: "d3",
            value: function() {
            }
        },
        {
            key: "d4",
            value: function() {
            }
        },
        {
            key: "e0",
            value: function(param) {
                var _param = _slicedToArray(param, 3);
                _param[0], _param[1], _param[2];
            }
        }
    ]), C2;
}(), C3 = function() {
    "use strict";
    function C3() {
        _classCallCheck(this, C3);
    }
    return _createClass(C3, [
        {
            key: "d3",
            value: function(param) {
                var _param = _slicedToArray(param, 3);
                _param[0], _param[1], _param[2];
            }
        },
        {
            key: "d4",
            value: function(param) {
                param.x, param.y, param.z;
            }
        },
        {
            key: "e0",
            value: function(param) {
                var _param = _slicedToArray(param, 3);
                _param[0], _param[1], _param[2];
            }
        }
    ]), C3;
}();
!function(param) {
    var ref = void 0 === param ? {
        x: 1,
        y: 2
    } : param;
    ref.x, ref.y;
}();
