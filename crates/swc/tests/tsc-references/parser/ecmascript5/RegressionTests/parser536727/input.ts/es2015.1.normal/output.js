function foo(f) {
    return f("");
}
var g = (x)=>x + "blah"
;
var x1 = ()=>g
;
foo(g);
foo(()=>g
);
foo(x1);
