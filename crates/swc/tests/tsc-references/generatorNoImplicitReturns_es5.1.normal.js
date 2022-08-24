// @target: esnext 
// @noImplicitReturns: true 
// @strictNullChecks: false 
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function testGenerator() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                if (Math.random() > 0.5) {
                    return [
                        2
                    ];
                }
                return [
                    4,
                    "hello"
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
