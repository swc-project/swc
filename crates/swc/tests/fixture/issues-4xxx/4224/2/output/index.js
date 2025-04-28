var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
class A {
    constructor(){
        this.foo = ()=>_async_to_generator._(function*() {
                this.x();
            }).call(this);
        this.bar = ()=>_async_to_generator._(function*() {
                this.x();
            }).call(this);
    }
}
console.log(A);
