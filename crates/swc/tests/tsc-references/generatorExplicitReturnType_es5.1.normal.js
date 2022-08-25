// @target: esnext
// @strictNullChecks: true
// @noImplicitReturns: true
// @noImplicitAny: true
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function g1() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent(); // error
                return [
                    4,
                    "a"
                ];
            case 2:
                _state.sent(); // error
                return [
                    4,
                    1
                ];
            case 3:
                x = _state.sent();
                return [
                    2,
                    10
                ]; // error
        }
    });
}
function g2() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                x = _state.sent();
                return [
                    2,
                    true
                ];
        }
    });
}
function g3() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(generator)
                ];
            case 1:
                x = _state.sent();
                return [
                    2,
                    true
                ];
        }
    });
}
function g4() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(generator)
                ];
            case 1:
                x = _state.sent();
                return [
                    2,
                    true
                ];
        }
    });
}
