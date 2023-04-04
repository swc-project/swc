import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
class A {
    constructor(){
        var _this = this;
        this.foo = /*#__PURE__*/ _async_to_generator(function*() {
            _this.x();
        });
        var _this1 = this;
        this.bar = /*#__PURE__*/ _async_to_generator(function*() {
            _this1.x();
        });
    }
}
console.log(A);
