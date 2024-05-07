var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
(function() {
    var _main = _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
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
