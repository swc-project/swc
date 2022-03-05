import * as swcHelpers from "@swc/helpers";
class B {
    m() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test), swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test = 10, new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    }
}
var _class, _Foo, _foo = {
    writable: !0,
    value: ((_class = class {
        constructor(){
            this.field = 10, console.log("hello"), new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo2))();
        }
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_Foo = class {
    }).otherClass = 123, _Foo)
};
