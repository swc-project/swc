var _bar, _baz, _qux;
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let C = (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), class {
    foo() {
        var _this = this;
        return _async_to_generator(function*() {
            let b = yield _class_private_method_get(_this, _bar, bar).call(_this);
            return b + (_class_private_method_get(_this, _baz, baz).call(_this).next().value || 0) + ((yield _class_private_method_get(_this, _qux, qux).call(_this).next()).value || 0);
        })();
    }
    constructor(){
        _class_private_method_init(this, _bar), _class_private_method_init(this, _baz), _class_private_method_init(this, _qux);
    }
});
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    return (_bar1 = _async_to_generator(function*() {
        return yield Promise.resolve(42);
    })).apply(this, arguments);
}
function* baz() {
    yield 42;
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    return (_qux1 = _wrap_async_generator(function*() {
        yield yield _await_async_generator(Promise.resolve(42));
    })).apply(this, arguments);
}
new C().foo().then(console.log);
