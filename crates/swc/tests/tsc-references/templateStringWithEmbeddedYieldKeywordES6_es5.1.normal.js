// @target: ES6
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function gen() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _ = "abc".concat;
                return [
                    4,
                    10
                ];
            case 1:
                x = _.apply(void 0, [
                    _state.sent(),
                    "def"
                ]);
                return [
                    2
                ];
        }
    });
}
