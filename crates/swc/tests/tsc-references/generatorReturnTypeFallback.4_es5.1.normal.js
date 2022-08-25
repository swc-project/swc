// @target: esnext
// @lib: es5,es2015.iterable
// @noemit: true
// @strict: false
// Allow generators to fallback to IterableIterator if they are not in strictNullChecks mode
// NOTE: In non-strictNullChecks mode, `undefined` (the default sent value) is assignable to everything.
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                x = _state.sent();
                return [
                    2
                ];
        }
    });
}
