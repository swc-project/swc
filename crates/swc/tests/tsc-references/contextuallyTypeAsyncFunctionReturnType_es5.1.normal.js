// @target: esnext
// @noImplicitAny: true
// @noEmit: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _async_to_generator(function() {
        var _tmp;
        return _ts_generator(this, function(_state) {
            _tmp = {};
            return [
                2,
                (_tmp.key = "value", _tmp)
            ];
        });
    });
    return _fn1.apply(this, arguments);
}
function fn2() {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                new Promise(function(resolve) {
                    resolve({
                        key: "value"
                    });
                })
            ];
        });
    });
    return _fn2.apply(this, arguments);
}
function fn3() {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _async_to_generator(function() {
        var _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _tmp = {};
                    return [
                        4,
                        (_tmp.key = "value", _tmp)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _fn3.apply(this, arguments);
}
function fn4() {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        new Promise(function(resolve) {
                            resolve({
                                key: "value"
                            });
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _fn4.apply(this, arguments);
}
