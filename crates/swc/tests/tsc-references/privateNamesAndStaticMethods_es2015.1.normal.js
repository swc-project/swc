import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: esnext, es2022
// @lib: esnext, es2022
// @useDefineForClassFields: false
class A {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(A, A, foo).call(A, 30);
        swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30);
        swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30);
        swcHelpers.classStaticPrivateFieldSpecSet(A, A, _quux, swcHelpers.classStaticPrivateFieldSpecGet(A, A, _quux) + 1);
        swcHelpers.classStaticPrivateFieldUpdate(A, _quux).value++;
    }
}
var _quux = {
    get: get_quux,
    set: set_quux
};
var __quux = {
    writable: true,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    _bar = swcHelpers.asyncToGenerator(function*(a) {});
    return _bar.apply(this, arguments);
}
function baz(a) {
    return _baz.apply(this, arguments);
}
function _baz() {
    _baz = swcHelpers.wrapAsyncGenerator(function*(a) {
        return 3;
    });
    return _baz.apply(this, arguments);
}
function get_quux() {
    return swcHelpers.classStaticPrivateFieldSpecGet(this, A, __quux);
}
function set_quux(val) {
    swcHelpers.classStaticPrivateFieldSpecSet(this, A, __quux, val);
}
class B extends A {
    constructor(){
        super();
        swcHelpers.classStaticPrivateMethodGet(B, B, foo1).call(B, "str");
    }
}
function foo1(a) {}
