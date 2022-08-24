import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
        }).apply(this);
    }
};
obj.method().then(function(v) {
    return console.log(v);
});
