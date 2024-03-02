"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Test", {
    enumerable: true,
    get: function() {
        return Test;
    }
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
class Test {
    bad() {
        var _this = this;
        return _async_to_generator._(function*() {
            let foo = false;
            [foo] = yield Promise.all([
                _this.foo()
            ]);
        })();
    }
    good() {
        var _this = this;
        return _async_to_generator._(function*() {
            let [foo] = yield Promise.all([
                _this.foo()
            ]);
        })();
    }
    foo() {
        return _async_to_generator._(function*() {
            return true;
        })();
    }
}
