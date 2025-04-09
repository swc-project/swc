class Foo extends Bar {
    constructor(options){
        super({
            callA: ()=>/*#__PURE__*/ _async_to_generator(function*() {
                    this.callA();
                }).call(this)
        });
    }
}
