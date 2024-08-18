var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
class A {
    constructor(){
        var _this = this;
        this.foo = /*#__PURE__*/ _async_to_generator._(function*() {
            _this.x();
        });
        this.bar = /*#__PURE__*/ _async_to_generator._(function*() {
            _this.x();
        });
    }
}
console.log(A);
