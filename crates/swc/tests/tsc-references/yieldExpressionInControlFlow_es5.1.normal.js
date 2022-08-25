// @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @lib: esnext
// @Filename: bug25149.js
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
// @Filename: alsoFails.ts
// fails in Typescript too
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
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
