// @target: esnext
// @strict: true
// #35995
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f1() {
    var _tmp;
    return _ts_generator(this, function(_state) {
        _tmp = {};
        return [
            2,
            (_tmp.x = "x", _tmp)
        ];
    });
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function() {
        var _tmp;
        return _ts_generator(this, function(_state) {
            _tmp = {};
            return [
                2,
                (_tmp.x = "x", _tmp)
            ];
        });
    });
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(function() {
        var _tmp;
        return _ts_generator(this, function(_state) {
            _tmp = {};
            return [
                2,
                Promise.resolve((_tmp.x = "x", _tmp))
            ];
        });
    });
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(function() {
        var ret, _tmp;
        return _ts_generator(this, function(_state) {
            _tmp = {};
            ret = (_tmp.x = "x", _tmp);
            return [
                2,
                Promise.resolve(ret)
            ]; // Error
        });
    });
    return _f4.apply(this, arguments);
}
