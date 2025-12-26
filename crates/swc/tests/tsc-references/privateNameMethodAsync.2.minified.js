//// [privateNameMethodAsync.ts]
var _bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet();
new class {
    async foo() {
        return await bar.call(this) + (baz.call(this).next().value || 0) + ((await qux.call(this).next()).value || 0);
    }
    constructor(){
        _bar.add(this), _baz.add(this), _qux.add(this);
    }
}().foo().then(console.log);
