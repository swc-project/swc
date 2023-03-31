"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _ts_generator = require("@swc/helpers/lib/_ts_generator.js").default;
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
