import * as swcHelpers from "@swc/helpers";
var _class, _Foo, B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.m = function() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test), swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test = 10, new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    }, B;
}(), _foo = {
    writable: !0,
    value: ((_class = function _class1() {
        swcHelpers.classCallCheck(this, _class1), this.field = 10, console.log("hello"), new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo2))();
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_Foo = function Foo() {
        swcHelpers.classCallCheck(this, Foo);
    }).otherClass = 123, _Foo)
};
