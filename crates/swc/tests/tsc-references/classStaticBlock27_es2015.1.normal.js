// https://github.com/microsoft/TypeScript/issues/44872
var _Foo, __, __1, __2;
void (_Foo = class Foo {
}, _Foo.prop = 1, __ = {
    writable: true,
    value: (()=>{
        console.log(_Foo.prop);
        _Foo.prop++;
    })()
}, __1 = {
    writable: true,
    value: (()=>{
        console.log(_Foo.prop);
        _Foo.prop++;
    })()
}, __2 = {
    writable: true,
    value: (()=>{
        console.log(_Foo.prop);
        _Foo.prop++;
    })()
}, _Foo);
