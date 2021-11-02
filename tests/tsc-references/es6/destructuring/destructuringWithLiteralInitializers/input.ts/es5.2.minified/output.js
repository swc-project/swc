var param1;
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
function f2(param) {
    void 0 === _y, param.x;
    var _y = param.y;
}
function f3(param) {
    param.x, param.y;
}
function f4(param) {
    var ref = void 0 === param ? {
        x: 0,
        y: 0
    } : param;
    ref.x, ref.y;
}
function f5(param) {
    var ref = void 0 === param ? {
        x: 0
    } : param;
    ref.x, ref.y;
}
function f6(param) {
    var ref = void 0 === param ? {
    } : param;
    ref.x, ref.y;
}
function f7(param) {
    var _a = (void 0 === param ? {
        a: {
        }
    } : param).a;
    _a.x, _a.y;
}
function g3(param) {
    var ref = _slicedToArray(void 0 === param ? [
        0,
        0
    ] : param, 2);
    ref[0], ref[1];
}
function g4(param) {
    var ref = _slicedToArray(void 0 === param ? [
        0
    ] : param, 2);
    ref[0], ref[1];
}
function g5(param) {
    var ref = _slicedToArray(void 0 === param ? [] : param, 2);
    ref[0], ref[1];
}
(param1 = {
    x: 1,
    y: 1
}).x, param1.y, f2({
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
}), (function(param) {
    var _param = _slicedToArray(param, 2);
    _param[0], _param[1];
})([
    1,
    1
]), (function(param) {
    var _param = _slicedToArray(param, 2);
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
