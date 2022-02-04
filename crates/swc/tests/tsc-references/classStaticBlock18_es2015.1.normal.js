var _class, _class1;
// @target: esnext, es2022, es2015, es5
function foo() {
    return _class1 = (function() {
        class _class2 {
        }
        var __ = {
            writable: true,
            value: (()=>{
                const c = (_class = function() {
                    class _class3 {
                    }
                    var __ = {
                        writable: true,
                        value: (()=>{
                        // do
                        })()
                    };
                    return _class3;
                }(), _class.bar = 2, _class);
            })()
        };
        return _class2;
    })(), _class1.foo = 1, _class1;
}
