var E1, E2, s, E11, E21;
function foo(x) {
}
foo({
    read: ()=>s
    ,
    write: (value)=>s = value
}), foo({
    write: (value)=>s = value
    ,
    read: ()=>s
}), (E1 = E11 || (E11 = {
}))[E1.X = 0] = "X", (E2 = E21 || (E21 = {
}))[E2.X = 0] = "X", f1({
    w: (x)=>x
    ,
    r: ()=>0
}, 0), f1({
    w: (x)=>x
    ,
    r: ()=>0
}, E11.X), f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, 0), f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, E11.X), f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, E21.X);
