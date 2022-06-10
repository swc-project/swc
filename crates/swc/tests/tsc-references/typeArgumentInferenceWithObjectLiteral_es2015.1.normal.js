function foo(x) {}
var s;
// Calls below should infer string for T and then assign that type to the value parameter
foo({
    read: ()=>s,
    write: (value)=>s = value
});
foo({
    write: (value)=>s = value,
    read: ()=>s
});
var E1;
(function(E1) {
    E1[E1["X"] = 0] = "X";
})(E1 || (E1 = {}));
var E2;
(function(E2) {
    E2[E2["X"] = 0] = "X";
})(E2 || (E2 = {}));
var v1;
var v1 = f1({
    w: (x)=>x,
    r: ()=>0
}, 0);
var v1 = f1({
    w: (x)=>x,
    r: ()=>0
}, E1.X);
var v1 = f1({
    w: (x)=>x,
    r: ()=>E1.X
}, 0);
var v2;
var v2 = f1({
    w: (x)=>x,
    r: ()=>E1.X
}, E1.X);
var v3 = f1({
    w: (x)=>x,
    r: ()=>E1.X
}, E2.X); // Error
