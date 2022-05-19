function foo(f) {
    return f("");
}
var g = (x)=>x + "blah";
foo(g), foo(()=>g), foo(()=>g);
