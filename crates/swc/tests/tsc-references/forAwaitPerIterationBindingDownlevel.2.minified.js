//// [forAwaitPerIterationBindingDownlevel.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var sleep = function(tm) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, tm);
    });
};
function _gen() {
    return (_gen = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        1
                    ];
                case 1:
                    return _state.sent(), [
                        4,
                        _await_async_generator(sleep(1000))
                    ];
                case 2:
                    return _state.sent(), [
                        4,
                        2
                    ];
                case 3:
                    return _state.sent(), [
                        2
                    ];
            }
        });
    })).apply(this, arguments);
}
var log = console.log;
_async_to_generator(function() {
    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _iteratorAbruptCompletion = !1, _didIteratorError = !1, _state.label = 1;
            case 1:
                _state.trys.push([
                    1,
                    6,
                    7,
                    12
                ]), _loop = function() {
                    var _value = _step.value;
                    log("I'm loop ".concat(_value)), _async_to_generator(function() {
                        var inner;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return inner = _value, [
                                        4,
                                        sleep(2000)
                                    ];
                                case 1:
                                    return _state.sent(), inner === _value ? log("I'm loop ".concat(inner, " and I know I'm loop ").concat(_value)) : log("I'm loop ".concat(inner, ", but I think I'm loop ").concat(_value)), [
                                        2
                                    ];
                            }
                        });
                    })();
                }, _iterator = _async_iterator(function() {
                    return _gen.apply(this, arguments);
                }()), _state.label = 2;
            case 2:
                return [
                    4,
                    _iterator.next()
                ];
            case 3:
                if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                    3,
                    5
                ];
                _loop(), _state.label = 4;
            case 4:
                return _iteratorAbruptCompletion = !1, [
                    3,
                    2
                ];
            case 5:
                return [
                    3,
                    12
                ];
            case 6:
                return err = _state.sent(), _didIteratorError = !0, _iteratorError = err, [
                    3,
                    12
                ];
            case 7:
                if (_state.trys.push([
                    7,
                    ,
                    10,
                    11
                ]), !(_iteratorAbruptCompletion && null != _iterator.return)) return [
                    3,
                    9
                ];
                return [
                    4,
                    _iterator.return()
                ];
            case 8:
                _state.sent(), _state.label = 9;
            case 9:
                return [
                    3,
                    11
                ];
            case 10:
                if (_didIteratorError) throw _iteratorError;
                return [
                    7
                ];
            case 11:
                return [
                    7
                ];
            case 12:
                return [
                    2
                ];
        }
    });
})();
