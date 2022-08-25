// @target: esnext
// @lib: es5,es2015.iterable
// @noemit: true
// @strict: true
// Do not allow generators to fallback to IterableIterator while in strictNullChecks mode if they need a type for the sent value.
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
