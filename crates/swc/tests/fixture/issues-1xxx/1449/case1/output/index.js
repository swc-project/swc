import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        var tmp, ref;
        return _ts_generator(this, function(_state) {
            tmp = baz.bar, ref = _object_destructuring_empty(tmp === void 0 ? {} : tmp);
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
