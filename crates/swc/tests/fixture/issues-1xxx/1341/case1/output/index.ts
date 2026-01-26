"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const _define_property = require("@swc/helpers/_/_define_property");
class A {
    foo() {
        return _async_to_generator._(function*() {
            try {
                return yield ((x)=>_async_to_generator._(function*() {
                        return x + this.val;
                    }).call(this))("a"); // this is undefined
            // return await Promise.all(['a', 'b'].map(async (x) => x + this.val)); // this is undefined
            } catch (e) {
                throw e;
            }
        }).call(this);
    }
    constructor(){
        _define_property._(this, "val", "1");
    }
}
new A().foo();
