var c, d;
function foo(t, t2) {
    return (x)=>t2;
}
foo(c, d), foo(d, c), foo(c, {
    x: '',
    foo: c
}), foo(null, null), foo({}, null), foo(null, {}), foo({}, {}), foo(()=>{}, ()=>{}), foo(()=>{}, ()=>1);
