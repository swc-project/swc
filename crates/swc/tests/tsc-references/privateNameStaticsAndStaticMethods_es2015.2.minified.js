import * as swcHelpers from "@swc/helpers";
class A {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(A, A, foo).call(A, 30), swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30), swcHelpers.classStaticPrivateMethodGet(A, A, bar).call(A, 30), swcHelpers.classStaticPrivateFieldSpecSet(A, A, _quux, swcHelpers.classStaticPrivateFieldSpecGet(A, A, _quux) + 1), swcHelpers.classStaticPrivateFieldUpdate(A, A, _quux).value++;
    }
}
var _quux = {
    get: function() {
        return swcHelpers.classStaticPrivateFieldSpecGet(this, A, __quux);
    },
    set: function(val) {
        swcHelpers.classStaticPrivateFieldSpecSet(this, A, __quux, val);
    }
}, __quux = {
    writable: !0,
    value: void 0
};
function foo(a) {}
function bar(a) {
    return _bar.apply(this, arguments);
}
function _bar() {
    return (_bar = swcHelpers.asyncToGenerator(function*(a) {})).apply(this, arguments);
}
class B extends A {
    constructor(){
        super(), swcHelpers.classStaticPrivateMethodGet(B, B, foo1).call(B, "str");
    }
}
function foo1(a) {}
