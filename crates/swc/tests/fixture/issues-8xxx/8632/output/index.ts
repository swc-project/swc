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
        return /*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
            let foo = false;
            [foo] = yield Promise.all([
                this.foo()
            ]);
        }).call(this);
    }
    good() {
        return /*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
            let [foo] = yield Promise.all([
                this.foo()
            ]);
        }).call(this);
    }
    foo() {
        return /*#__PURE__*/ /*#__PURE__*/ _async_to_generator._(function*() {
            return true;
        })();
    }
}
