//// [privateNameMethodAsync.ts]
var _bar, _baz, _qux;
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
async function bar() {
    return await Promise.resolve(42);
}
function* baz() {
    yield 42;
}
async function* qux() {
    yield await Promise.resolve(42);
}
new (_bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet(), _qux = /*#__PURE__*/ new WeakSet(), class {
    async foo() {
        return await _class_private_method_get(this, _bar, bar).call(this) + (_class_private_method_get(this, _baz, baz).call(this).next().value || 0) + ((await _class_private_method_get(this, _qux, qux).call(this).next()).value || 0);
    }
    constructor(){
        _class_private_method_init(this, _bar), _class_private_method_init(this, _baz), _class_private_method_init(this, _qux);
    }
})().foo().then(console.log);
