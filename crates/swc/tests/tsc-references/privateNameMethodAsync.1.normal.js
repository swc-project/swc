//// [privateNameMethodAsync.ts]
var _bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), _class;
const C = (_class = class {
    async foo() {
        const b = await bar.call(this);
        return b + (baz.call(this).next().value || 0) + ((await qux.call(this).next()).value || 0);
    }
    constructor(){
        _bar.add(this);
        _baz.add(this);
        _qux.add(this);
    }
}, _class);
new C().foo().then(console.log);
