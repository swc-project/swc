var b, b2, f2;
function foo(x) {
    return x;
}
function foo2(x) {
    return x;
}
foo(1), foo(()=>{
}, 1), foo(1, ()=>{
}), foo2(new Function()), foo2((x)=>x
), foo2(class {
}), foo2(b), foo2((x)=>x
), foo2((x, y)=>x
), foo2(class {
}), foo2(b2), foo2(f2);
