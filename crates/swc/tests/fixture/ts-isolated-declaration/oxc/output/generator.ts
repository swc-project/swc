// Correct
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function generatorGood() {
    return _ts_generator(this, function(_state) {
        return [
            2
        ];
    });
}
// Need to explicit return type for async functions
// Incorrect
function generatorGoodBad() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    50
                ];
            case 1:
                _state.sent();
                return [
                    2,
                    42
                ];
        }
    });
}
