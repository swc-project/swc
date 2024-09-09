import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
export var foo = /*#__PURE__*/ function() {
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
