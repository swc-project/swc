import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
(function() {
    var _main = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            console.log(1);
            return [
                2
            ];
        });
    });
    function main() {
        return _main.apply(this, arguments);
    }
    return main;
})()();
