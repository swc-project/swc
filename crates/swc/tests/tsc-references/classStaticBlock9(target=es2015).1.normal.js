//// [classStaticBlock9.ts]
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
