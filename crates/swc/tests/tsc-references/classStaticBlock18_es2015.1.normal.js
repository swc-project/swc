var _class, _class1;
// @target: esnext, es2022, es2015, es5
function foo() {
    var _class2, __1;
    return _class1 = (_class2 = class {
    }, __1 = {
        writable: true,
        value: (()=>{
            var _class3, __;
            const c = (_class = (_class3 = class {
            }, __ = {
                writable: true,
                value: (()=>{
                // do
                })()
            }, _class3), _class.bar = 2, _class);
        })()
    }, _class2), _class1.foo = 1, _class1;
}
