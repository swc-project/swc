function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
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
        var _s, _e, _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
        if (null != _i) {
            var _arr = [], _n = !0, _d = !1;
            try {
                for(_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
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
        }
    })(arr, i) || _unsupportedIterableToArray(arr, i) || (function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
function a1(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref1 = _slicedToArray(ref[0], 1);
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
]), (function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
})([
    1,
    2,
    3
]), b2("string", {
    x: 200,
    y: "string"
}), b2("string", {
    x: 200,
    y: !0
}), (Foo = Foo || (Foo = {
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
}), (function() {
    (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        b: "hello"
    }).b;
})({
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
var Foo, Foo, C2 = function() {
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
!function() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 1,
        y: 2
    };
    ref.x, ref.y;
}();
