class Base {
    constructor(){
        this.Foo = (function() {
            class _class {
            }
            var __ = {
                writable: true,
                value: (()=>{
                    _class.foo = void 0;
                })()
            };
            return _class;
        })();
    }
}
