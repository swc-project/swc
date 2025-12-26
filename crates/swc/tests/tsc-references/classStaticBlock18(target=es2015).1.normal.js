//// [classStaticBlock18.ts]
function foo() {
    var _class;
    return _class = class {
    }, _class.foo = 1, (()=>{
        var _class;
        const c = (_class = class {
        }, _class.bar = 2, _class);
    })(), _class;
}
