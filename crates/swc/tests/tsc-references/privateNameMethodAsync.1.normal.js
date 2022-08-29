//// [privateNameMethodAsync.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _bar, _baz, _qux, _class;
const C = (_bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), _qux = /*#__PURE__*/ new WeakSet(), _class = class {
    async foo() {
        const b = await _class_private_method_get(this, _bar, bar).call(this);
        return b + (_class_private_method_get(this, _baz, baz).call(this).next().value || 0) + ((await _class_private_method_get(this, _qux, qux).call(this).next()).value || 0);
    }
    constructor(){
        _class_private_method_init(this, _bar);
        _class_private_method_init(this, _baz);
        _class_private_method_init(this, _qux);
    }
}, _class);
new C().foo().then(console.log);
async function bar() {
    return await Promise.resolve(42);
}
function* baz() {
    yield 42;
}
async function* qux() {
    yield await Promise.resolve(42);
}
