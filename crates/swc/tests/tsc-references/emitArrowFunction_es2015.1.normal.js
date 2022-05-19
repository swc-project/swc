// @target:es5
var f1 = ()=>{};
var f2 = (x, y)=>{};
var f3 = (x, y, ...rest)=>{};
var f4 = (x, y, z = 10)=>{};
function foo(func) {}
foo(()=>true);
foo(()=>{
    return false;
});
