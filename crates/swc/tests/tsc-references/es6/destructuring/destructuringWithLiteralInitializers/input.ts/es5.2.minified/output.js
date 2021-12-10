var param;
function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
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
function f2(param1) {
    void 0 === _y, param1.x;
    var _y = param1.y;
}
function f3(param2) {
    param2.x, param2.y;
}
function f4() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0,
        y: 0
    };
    ref.x, ref.y;
}
function f5() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0
    };
    ref.x, ref.y;
}
function f6() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
    };
    ref.x, ref.y;
}
function f7() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        a: {
        }
    }, _a = ref.a;
    _a.x, _a.y;
}
function g3() {
    var ref = _slicedToArray(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0,
        0
    ], 2);
    ref[0], ref[1];
}
function g4() {
    var ref = _slicedToArray(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0
    ], 2);
    ref[0], ref[1];
}
function g5() {
    var ref = _slicedToArray(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], 2);
    ref[0], ref[1];
}
(param = {
    x: 1,
    y: 1
}).x, param.y, f2({
    x: 1
}), f2({
    x: 1,
    y: 1
}), f3({
}), f3({
    x: 1
}), f3({
    y: 1
}), f3({
    x: 1,
    y: 1
}), f4(), f4({
    x: 1,
    y: 1
}), f5(), f5({
    x: 1
}), f5({
    x: 1,
    y: 1
}), f6(), f6({
}), f6({
    x: 1
}), f6({
    y: 1
}), f6({
    x: 1,
    y: 1
}), f7(), f7({
    a: {
    }
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
}), (function(param3) {
    var _param = _slicedToArray(param3, 2);
    _param[0], _param[1];
})([
    1,
    1
]), (function(param4) {
    var _param = _slicedToArray(param4, 2);
    _param[0], _param[1];
})([
    1,
    1
]), g3(), g3([
    1,
    1
]), g4(), g4([
    1,
    1
]), g5(), g5([
    1,
    1
]);
