// Generic call with constraints infering type parameter from object member properties
class C {
}
class D {
}
function foo(t, t2) {
    return (x)=>t2;
}
var c;
var d;
var r2 = foo(d, c); // the constraints are self-referencing, no downstream error
var r9 = foo(()=>1, ()=>{}); // the constraints are self-referencing, no downstream error
function other() {
    var r5 = foo(c, d); // error
}
