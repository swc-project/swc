"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
class A {
    foo() {
        var _this = this;
        return _asyncToGenerator(function*() {
            try {
                return yield (function() {
                    var _ref = _asyncToGenerator(function*(x) {
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
        _defineProperty(this, "val", "1");
    }
}
new A().foo();
