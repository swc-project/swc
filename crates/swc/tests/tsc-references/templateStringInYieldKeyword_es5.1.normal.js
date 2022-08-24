// @target: es6
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function gen() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    "abc".concat(x, "def")
                ];
            case 1:
                x = _state.sent();
                return [
                    2
                ];
        }
    });
}
