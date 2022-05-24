import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: es5
// @lib: esnext, dom
// @downlevelIteration: true
// https://github.com/Microsoft/TypeScript/issues/24722
class A {
    constructor(){
        var _this = this;
        this.b = _async_to_generator(function*(...args) {
            yield Promise.resolve();
            const obj = {
                ["a"]: ()=>_this
            }; // computed property name after `await` triggers case
        });
    }
}
