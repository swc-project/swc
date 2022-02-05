var _class;
// https://github.com/microsoft/TypeScript/issues/44872
void (_class = function() {
    class Foo {
    }
    var __ = {
        writable: true,
        value: (()=>{
            console.log(Foo.prop);
            Foo.prop++;
        })()
    };
    var __1 = {
        writable: true,
        value: (()=>{
            console.log(Foo.prop);
            Foo.prop++;
        })()
    };
    var __2 = {
        writable: true,
        value: (()=>{
            console.log(Foo.prop);
            Foo.prop++;
        })()
    };
    return Foo;
}(), _class.prop = 1, _class);
