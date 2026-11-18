class Foo {
    constractur() {
        const foo = ()=>_async_to_generator(function*() {
                return new.target;
            })();
    }
    hello() {
        const world = ()=>{
            var _this = this, _superprop_get_hello = ()=>super.hello;
            _async_to_generator(function*() {
                return _superprop_get_hello().call(_this);
            })();
        };
    }
}
