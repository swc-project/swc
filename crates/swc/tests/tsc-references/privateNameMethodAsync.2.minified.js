//// [privateNameMethodAsync.ts]
var _bar, _baz, _qux, _class;
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
let C = (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), _class = class {
    async foo() {
        let b = await _class_private_method_get(this, _bar, bar).call(this);
        return b + (_class_private_method_get(this, _baz, baz).call(this).next().value || 0) + ((await _class_private_method_get(this, _qux, qux).call(this).next()).value || 0);
    }
    constructor(){
        _class_private_method_init(this, _bar), _class_private_method_init(this, _baz), _class_private_method_init(this, _qux);
    }
});
async function bar() {
    return await Promise.resolve(42);
}
function* baz() {
    yield 42;
}
async function* qux() {
    yield await Promise.resolve(42);
}
new C().foo().then(console.log);
