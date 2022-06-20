"use strict";
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js");
class A {
    foo() {
        var _this = this;
        return (0, _asyncToGeneratorMjs.default)(function*() {
            try {
                return yield (function() {
                    var _ref = (0, _asyncToGeneratorMjs.default)(function*(x) {
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
