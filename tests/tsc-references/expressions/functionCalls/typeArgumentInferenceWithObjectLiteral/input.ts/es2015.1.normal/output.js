function foo(x) {
}
var s;
// Calls below should infer string for T and then assign that type to the value parameter
foo({
    read: ()=>s
    ,
    write: (value)=>s = value
});
foo({
    write: (value)=>s = value
    ,
    read: ()=>s
});
var E11;
(function(E1) {
    E1[E1["X"] = 0] = "X";
})(E11 || (E11 = {
}));
var E21;
(function(E2) {
    E2[E2["X"] = 0] = "X";
})(E21 || (E21 = {
}));
var v1;
var v1 = f1({
    w: (x)=>x
    ,
    r: ()=>0
}, 0);
var v1 = f1({
    w: (x)=>x
    ,
    r: ()=>0
}, E11.X);
var v1 = f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, 0);
var v2;
var v2 = f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, E11.X);
var v3 = f1({
    w: (x)=>x
    ,
    r: ()=>E11.X
}, E21.X); // Error
