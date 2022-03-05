// @target: esnext, es2022, es2015, es5
function foo() {
    var _class1, __1;
    return _class1 = class {
    }, _class1.foo = 1, __1 = {
        writable: true,
        value: (()=>{
            var _class, __;
            const c = (_class = class {
            }, _class.bar = 2, __ = {
                writable: true,
                value: (()=>{
                // do
                })()
            }, _class);
        })()
    }, _class1;
}
