class Foo extends Bar {
    constructor(options){
        var _this;
        super({
            callA: _async_to_generator(function*() {
                _this.callA();
            })
        }), _this = this;
    }
}
