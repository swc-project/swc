function foo(f) {
    return f("");
}
var g = (x)=>x + "blah";
var x = ()=>g;
foo(g);
foo(()=>g);
foo(x);
