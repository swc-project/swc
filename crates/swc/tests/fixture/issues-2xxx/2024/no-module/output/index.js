import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
_async_to_generator(function() {
    var sleep, result;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                sleep = function() {
                    return new Promise(function(resolve) {
                        return setTimeout(function() {
                            return resolve(undefined);
                        }, 500);
                    });
                };
                return [
                    4,
                    sleep()
                ];
            case 1:
                result = _state.sent() || "fallback";
                console.log(result);
                return [
                    2
                ];
        }
    });
})();
