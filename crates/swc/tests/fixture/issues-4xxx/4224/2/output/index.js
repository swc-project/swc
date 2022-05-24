import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
class A {
    constructor(){
        var _this = this;
        this.foo = _async_to_generator(function*() {
            _this.x();
        });
        var _this1 = this;
        this.bar = _async_to_generator(function*() {
            _this1.x();
        });
    }
}
console.log(A);
