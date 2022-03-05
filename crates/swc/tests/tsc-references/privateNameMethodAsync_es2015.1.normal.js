import * as swcHelpers from "@swc/helpers";
var _bar, _baz, _qux, _class;
// @target: es2019
const C = (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), _class = class {
    foo() {
        var _this = this;
        return swcHelpers.asyncToGenerator(function*() {
            const b = yield swcHelpers.classPrivateMethodGet(_this, _bar, bar).call(_this);
            return b + (swcHelpers.classPrivateMethodGet(_this, _baz, baz).call(_this).next().value || 0) + ((yield swcHelpers.classPrivateMethodGet(_this, _qux, qux).call(_this).next()).value || 0);
        })();
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _bar);
        swcHelpers.classPrivateMethodInit(this, _baz);
        swcHelpers.classPrivateMethodInit(this, _qux);
    }
}, _class);
new C().foo().then(console.log);
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = swcHelpers.asyncToGenerator(function*() {
        return yield Promise.resolve(42);
    });
    return _bar1.apply(this, arguments);
}
function* baz() {
    yield 42;
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    _qux1 = swcHelpers.wrapAsyncGenerator(function*() {
        yield yield swcHelpers.awaitAsyncGenerator(Promise.resolve(42));
    });
    return _qux1.apply(this, arguments);
}
