class Base {
    constructor(){
        var _class, __;
        this.Foo = (_class = class {
        }, __ = {
            writable: true,
            value: (()=>{
                _class.foo = void 0;
            })()
        }, _class);
    }
}
