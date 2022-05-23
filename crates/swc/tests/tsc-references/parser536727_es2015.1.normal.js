function foo(f) {
    return f("");
}
var g = (x1)=>x1 + "blah";
var x = ()=>g;
foo(g);
foo(()=>g);
foo(x);
