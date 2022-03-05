import * as swcHelpers from "@swc/helpers";
var _class, _Foo;
// @target: es2015
class B {
    m() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test);
        swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo).test = 10;
        new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo))().field;
    }
}
var _foo = {
    writable: true,
    value: (_class = class {
        constructor(){
            this.field = 10;
            console.log("hello");
            new (swcHelpers.classStaticPrivateFieldSpecGet(B, B, _foo2))();
        }
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_Foo = class Foo {
    }, _Foo.otherClass = 123, _Foo)
};
