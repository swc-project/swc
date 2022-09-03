//// [emitArrowFunctionThisCapturingES6.ts]
var f1 = ()=>{
    this.age = 10;
}, f2 = (x)=>{
    this.name = x;
};
function foo(func) {}
foo(()=>(this.age = 100, !0));
