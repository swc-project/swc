import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
