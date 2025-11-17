//// [bug25149.js]
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f() {
    var o;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                if (!true) return [
                    3,
                    2
                ];
                return [
                    4,
                    o
                ];
            case 1:
                o = _state.sent();
                return [
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
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _ts_values } from "@swc/helpers/_/_ts_values";
// fails in Typescript too
function g() {
    var o;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                o = [];
                _state.label = 1;
            case 1:
                if (!true) return [
                    3,
                    3
                ];
                return [
                    5,
                    _ts_values(o)
                ];
            case 2:
                o = _state.sent();
                return [
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
