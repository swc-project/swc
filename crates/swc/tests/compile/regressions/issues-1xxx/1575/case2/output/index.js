import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var obj = {
    foo: 5,
    method: function method() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2,
                    this.foo
                ];
            });
        }).call(this);
    }
};
obj.method().then(function(v) {
    return console.log(v);
});
