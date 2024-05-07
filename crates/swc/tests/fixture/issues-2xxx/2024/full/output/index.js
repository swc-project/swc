var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
_async_to_generator._(function() {
    var sleep, result;
    return _ts_generator._(this, function(_state) {
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
