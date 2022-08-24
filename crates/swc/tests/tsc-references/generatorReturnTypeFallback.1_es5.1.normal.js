// @target: esnext
// @lib: es5,es2015.iterable
// @noemit: true
// @strict: true
// Allow generators to fallback to IterableIterator if they do not need a type for the sent value while in strictNullChecks mode.
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
