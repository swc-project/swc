export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function _compute() {
    return (_compute = _async_to_generator(function(promise) {
        var j;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        promise
                    ];
                case 1:
                    if (j = _state.sent()) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        import("./1")
                    ];
                case 2:
                    return [
                        2,
                        (j = _state.sent()).backup()
                    ];
                case 3:
                    return [
                        2,
                        j.foo()
                    ];
            }
        });
    })).apply(this, arguments);
}
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
