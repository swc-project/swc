// @target: es2017
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function bar() {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        42
                    ];
                case 1:
                    !_state.sent(); // OK
                    return [
                        2
                    ];
            }
        });
    });
    return _bar.apply(this, arguments);
}
function bar1() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        42
                    ];
                case 1:
                    +_state.sent(); // OK
                    return [
                        2
                    ];
            }
        });
    });
    return _bar1.apply(this, arguments);
}
function bar3() {
    return _bar3.apply(this, arguments);
}
function _bar3() {
    _bar3 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        42
                    ];
                case 1:
                    -_state.sent(); // OK
                    return [
                        2
                    ];
            }
        });
    });
    return _bar3.apply(this, arguments);
}
function bar4() {
    return _bar4.apply(this, arguments);
}
function _bar4() {
    _bar4 = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        42
                    ];
                case 1:
                    ~_state.sent(); // OK
                    return [
                        2
                    ];
            }
        });
    });
    return _bar4.apply(this, arguments);
}
