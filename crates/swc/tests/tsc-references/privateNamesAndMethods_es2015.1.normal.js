import * as swcHelpers from "@swc/helpers";
var _foo = new WeakSet(), _bar = new WeakSet(), _baz = new WeakSet(), __quux = new WeakMap(), _quux = new WeakMap();
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
class A {
    constructor(){
        var _this_quux;
        swcHelpers.classPrivateMethodInit(this, _foo);
        swcHelpers.classPrivateMethodInit(this, _bar);
        swcHelpers.classPrivateMethodInit(this, _baz);
        swcHelpers.classPrivateFieldInit(this, _quux, {
            get: get_quux,
            set: set_quux
        });
        swcHelpers.classPrivateFieldInit(this, __quux, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateMethodGet(this, _foo, foo).call(this, 30);
        swcHelpers.classPrivateMethodGet(this, _bar, bar).call(this, 30);
        swcHelpers.classPrivateMethodGet(this, _baz, baz).call(this, 30);
        swcHelpers.classPrivateFieldSet(this, _quux, swcHelpers.classPrivateFieldGet(this, _quux) + 1);
        swcHelpers.classPrivateFieldSet(this, _quux, (_this_quux = +swcHelpers.classPrivateFieldGet(this, _quux)) + 1), _this_quux;
    }
}
function foo(a) {}
function bar(a) {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = swcHelpers.asyncToGenerator(function*(a) {});
    return _bar1.apply(this, arguments);
}
function baz(a) {
    return _baz1.apply(this, arguments);
}
function _baz1() {
    _baz1 = swcHelpers.wrapAsyncGenerator(function*(a) {
        return 3;
    });
    return _baz1.apply(this, arguments);
}
function get_quux() {
    return swcHelpers.classPrivateFieldGet(this, __quux);
}
function set_quux(val) {
    swcHelpers.classPrivateFieldSet(this, __quux, val);
}
var _foo1 = new WeakSet();
class B extends A {
    constructor(){
        super();
        swcHelpers.classPrivateMethodInit(this, _foo1);
        swcHelpers.classPrivateMethodGet(this, _foo1, foo1).call(this, "str");
    }
}
function foo1(a) {}
