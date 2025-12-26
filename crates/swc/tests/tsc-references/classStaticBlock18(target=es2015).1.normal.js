//// [classStaticBlock18.ts]
function foo() {
    var __ = new WeakMap(), __2 = new WeakMap(), _class;
    return _class = class {
    }, __.set(_class, {
        writable: true,
        value: this.foo = 1
    }), __2.set(_class, {
        writable: true,
        value: (()=>{
            var __ = new WeakMap(), _class;
            const c = (_class = class {
            }, __.set(_class, {
                writable: true,
                value: this.bar = 2
            }), _class);
        })()
    }), _class;
}
