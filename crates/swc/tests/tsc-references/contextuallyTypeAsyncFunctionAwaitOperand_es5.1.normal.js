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
        var obj1, _tmp, obj2, _tmp1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _tmp = {};
                    return [
                        4,
                        (_tmp.key = "value", _tmp)
                    ];
                case 1:
                    obj1 = _state.sent();
                    return [
                        4,
                        new Promise(function(resolve) {
                            return resolve({
                                key: "value"
                            });
                        })
                    ];
                case 2:
                    obj2 = _state.sent();
                    _tmp1 = {};
                    return [
                        4,
                        (_tmp1.key = "value", _tmp1)
                    ];
                case 3:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _fn1.apply(this, arguments);
}
