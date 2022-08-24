// @target: esnext
// @strictNullChecks: true
// @noImplicitReturns: true
// @noImplicitAny: true
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function g() {
    return _ts_generator(this, function(_state) {
        return [
            2
        ];
    });
}
function g2() {
    var value;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                value = _state.sent();
                return [
                    2
                ];
        }
    });
}
function g3() {
    var value;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                value = _state.sent();
                return [
                    2
                ];
        }
    });
}
function g4() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent(); // ok, result is unused
                return [
                    4
                ];
            case 2:
                _state.sent(), noop(); // ok, result is unused
                noop();
                return [
                    4
                ];
            case 3:
                _state.sent(), noop(); // ok, result is unused
                return [
                    4
                ];
            case 4:
                _state.sent(); // ok, result is unused
                return [
                    4
                ];
            case 5:
                _state.sent(), noop(), noop(); // ok, result is unused
                return [
                    4
                ];
            case 6:
                _state.sent();
                _state.label = 7;
            case 7:
                if (!false) return [
                    3,
                    10
                ];
                _state.label = 8;
            case 8:
                return [
                    4
                ];
            case 9:
                _state.sent();
                return [
                    3,
                    7
                ];
            case 10:
                return [
                    4
                ];
            case 11:
                void _state.sent(); // ok, results are unused
                return [
                    2
                ];
        }
    });
}
function g5() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                f.apply(void 0, [
                    _state.sent()
                ]); // error: implicit any
                return [
                    2
                ];
        }
    });
}
function g6() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                f.apply(void 0, [
                    _state.sent()
                ]); // ok, contextually typed by f<string>
                return [
                    2
                ];
        }
    });
}
