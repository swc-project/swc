// @target: esnext, es2022, es2015, es5
class A {
}
A.bar = A.foo + 1;
var __ = {
    writable: true,
    value: (()=>{
        A.foo + 2;
    })()
};
A.foo = 1;
