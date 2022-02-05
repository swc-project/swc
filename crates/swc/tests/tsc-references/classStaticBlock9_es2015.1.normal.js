// @target: esnext, es2022, es2015, es5
class A {
}
var __ = {
    writable: true,
    value: (()=>{
        A.foo + 2;
    })()
};
A.bar = A.foo + 1;
A.foo = 1;
