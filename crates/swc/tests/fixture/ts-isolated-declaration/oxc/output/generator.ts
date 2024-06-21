// Correct
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function generatorGood() {
    return _ts_generator._(this, function(_state) {
        return [
            2
        ];
    });
}
// Need to explicit return type for async functions
// Incorrect
function generatorGoodBad() {
    return _ts_generator._(this, function(_state) {
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
