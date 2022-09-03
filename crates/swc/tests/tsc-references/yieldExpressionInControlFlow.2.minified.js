//// [bug25149.js]
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f() {
    var o;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    o
                ];
            case 1:
                return o = _state.sent(), [
                    3,
                    0
                ];
            case 2:
                return [
                    2
                ];
        }
    });
}
//// [alsoFails.ts]
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function g() {
    var o;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                o = [], _state.label = 1;
            case 1:
                return [
                    5,
                    _ts_values(o)
                ];
            case 2:
                return o = _state.sent(), [
                    3,
                    1
                ];
            case 3:
                return [
                    2
                ];
        }
    });
}
