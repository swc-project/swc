var i, b, c, i2, b2, c2, f2;
function foo(x) {
    return x;
}
foo(new Function()), foo((x)=>x
), foo((x)=>x
), foo(function(x) {
    return x;
}), foo(function(x) {
    return x;
}), foo(i), foo(class {
}), foo(b), foo(c), foo((x)=>x
), foo(function(x) {
    return x;
}), foo((x)=>x
), foo((x, y)=>x
), foo(i2), foo(class {
}), foo(b2), foo(c2), foo(f2);
