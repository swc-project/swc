"use strict";
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
class A {
    foo() {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                return yield (function() {
                    var _ref = _async_to_generator(function*(x) {
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
        this.val = "1";
    }
}
new A().foo();
