class Test0 {
}
class Test extends Test0 {
    constructor(){
        var _this;
        super(), _this = this, console.log((e)=>_async_to_generator(function*() {
                yield _this.test();
            })());
    }
}
