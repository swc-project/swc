import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function fn() {
    return _async_to_generator(function() {
        var key;
        return _ts_generator(this, function(_state) {
            for(var key in {});
            return [
                2
            ];
        });
    })();
}
