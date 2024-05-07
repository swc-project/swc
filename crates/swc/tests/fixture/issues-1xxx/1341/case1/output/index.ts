var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _define_property = require("@swc/helpers/_/_define_property");
class A {
    foo() {
        var _this = this;
        return _async_to_generator._(function*() {
            try {
                return yield (function() {
                    var _ref = _async_to_generator._(function*(x) {
                        return x + _this.val;
                    });
                    return function(x) {
                        return _ref.apply(this, arguments);
                    };
                })()("a"); // this is undefined
            // return await Promise.all(['a', 'b'].map(async (x) => x + this.val)); // this is undefined
            } catch (e) {
                throw e;
            }
        })();
    }
    constructor(){
        _define_property._(this, "val", "1");
    }
}
new A().foo();
