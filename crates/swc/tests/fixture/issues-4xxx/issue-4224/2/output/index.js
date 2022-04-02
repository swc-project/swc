import * as swcHelpers from "@swc/helpers";
class A {
    constructor(){
        var _this = this;
        this.foo = swcHelpers.asyncToGenerator(function*() {
            _this.x();
        });
        var _this1 = this;
        this.bar = swcHelpers.asyncToGenerator(function*() {
            _this1.x();
        });
    }
}
console.log(A);
