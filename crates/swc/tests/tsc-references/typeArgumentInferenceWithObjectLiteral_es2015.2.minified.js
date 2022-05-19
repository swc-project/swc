var s, E1, E2;
function foo(x) {}
foo({
    read: ()=>s,
    write: (value)=>s = value
}), foo({
    write: (value)=>s = value,
    read: ()=>s
}), function(E1) {
    E1[E1.X = 0] = "X";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.X = 0] = "X";
}(E2 || (E2 = {})), f1({
    w: (x)=>x,
    r: ()=>0
}, 0), f1({
    w: (x)=>x,
    r: ()=>0
}, E1.X), f1({
    w: (x)=>x,
    r: ()=>E1.X
}, 0), f1({
    w: (x)=>x,
    r: ()=>E1.X
}, E1.X), f1({
    w: (x)=>x,
    r: ()=>E1.X
}, E2.X);
