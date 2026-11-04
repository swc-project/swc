function s(_0) {
    return _async_to_generator(function*(x, ...args) {
        let t = (y, a)=>_async_to_generator(function*() {
                let r = (z, b, ...innerArgs)=>_async_to_generator(function*() {
                        yield z;
                        console.log(this, innerArgs, arguments);
                        return this.x;
                    }).apply(this, arguments);
                yield r();
                console.log(this, args, arguments);
                return this.g(r);
            }).apply(this, arguments);
        yield t();
        return this.h(t);
    }).apply(this, arguments);
}
