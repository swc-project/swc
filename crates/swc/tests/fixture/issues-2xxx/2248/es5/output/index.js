import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
export var foo = function() {
    var _ref = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            try {
                console.log(1);
            } catch (err) {
                console.log(err.message);
            }
            return [
                2
            ];
        });
    });
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
