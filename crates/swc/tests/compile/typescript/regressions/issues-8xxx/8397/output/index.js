import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function f() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        ...a,
        4,
        5
    ];
}
function af() {
    return _async_to_generator(function() {
        var a, b;
        return _ts_generator(this, function(_state) {
            a = [
                1,
                2,
                3
            ];
            b = [
                ...a,
                4,
                5
            ];
            return [
                2
            ];
        });
    })();
}
