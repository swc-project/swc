var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _type_of = require("@swc/helpers/lib/_type_of.js").default;
var _ts_generator = require("@swc/helpers/lib/_ts_generator.js").default;
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
function a() {
    return _a.apply(this, arguments);
}
function _a() {
    _a = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _a.apply(this, arguments);
}
console.log(typeof a === "undefined" ? "undefined" : _type_of(a));
