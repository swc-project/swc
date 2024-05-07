var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var obj = {
    foo: 5,
    method: function method() {
        return _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
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
