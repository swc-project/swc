var _Foo, __, __1, __2;
var _class;
// https://github.com/microsoft/TypeScript/issues/44872
void (_class = (_Foo = class Foo {
}, __ = {
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
}, _Foo), _class.prop = 1, _class);
