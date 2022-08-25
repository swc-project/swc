// @module: commonjs
// @target: esnext
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
// @filename: 2.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function compute(promise) {
    return _compute.apply(this, arguments);
}
function _compute() {
    _compute = _async_to_generator(function(promise) {
        var j;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        promise
                    ];
                case 1:
                    j = _state.sent();
                    if (!!j) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        import("./1")
                    ];
                case 2:
                    j = _state.sent();
                    return [
                        2,
                        j.backup()
                    ];
                case 3:
                    return [
                        2,
                        j.foo()
                    ];
            }
        });
    });
    return _compute.apply(this, arguments);
}
compute(import("./0"));
