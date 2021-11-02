var x1;
x1 = 3; // OK
x1 = 3; // OK
x1 = ''; // Error
x1 = ''; // Error
var M1;
(function(M) {
    var y;
    M.y = y;
})(M1 || (M1 = {
}));
M1.y = 3; // OK
M1.y = 3; // OK
M1.y = 3; // OK
M1.y = ''; // Error
M1.y = ''; // Error
M1.y = ''; // Error
M1 = {
    y: 3
}; // Error
M1 = {
    y: 3
}; // Error
var M21;
(function(M2) {
    var M31;
    (function(M3) {
        var x;
        M3.x = x;
    })(M31 || (M31 = {
    }));
    M31 = {
        x: 3
    }; // Error
    M2.M3 = M31;
})(M21 || (M21 = {
}));
M21.M3 = {
    x: 3
}; // OK
M21.M3 = {
    x: 3
}; // OK
M21.M3 = {
    x: 3
}; // OK
M21.M3 = {
    x: ''
}; // Error
M21.M3 = {
    x: ''
}; // Error
M21.M3 = {
    x: ''
}; // Error
function fn() {
}
fn = ()=>3
; // Bug 823548: Should be error (fn is not a reference)
fn = ()=>3
; // Should be error
function fn2(x, y) {
    x = 3;
    x = 3; // OK
    x = ''; // Error
    x = ''; // Error
    y.t = 3; // OK
    y.t = 3; // OK
    y.t = ''; // Error
    y.t = ''; // Error
    y['t'] = 3; // OK
    y['t'] = 3; // OK
    y['t'] = 3; // OK
    y['t'] = ''; // Error
    y['t'] = ''; // Error
    y['t'] = ''; // Error
}
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
E1 = undefined; // Error
E1 = undefined; // Error
class C {
}
C = undefined; // Error
C = undefined; // Error
