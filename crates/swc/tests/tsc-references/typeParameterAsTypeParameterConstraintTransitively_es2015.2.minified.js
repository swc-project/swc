var a, b, c;
function foo(x, y, z) {
    return z;
}
foo(1, 2, 3), foo({
    x: 1
}, {
    x: 1,
    y: ''
}, {
    x: 2,
    y: '',
    z: !0
}), foo(a, b, c), foo(a, b, {
    foo: 1,
    bar: '',
    hm: !0
}), foo((x, y)=>{}, (x)=>{}, ()=>{}), foo(a, a, a), foo(a, b, c), foo(b, b, {
    foo: 1,
    bar: '',
    hm: ''
});
