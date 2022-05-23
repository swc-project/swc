var x;
x = 3; // OK
x = 3; // OK
x = ''; // Error
x = ''; // Error
var M;
(function(M1) {
    var y;
    M1.y = y;
})(M || (M = {}));
M.y = 3; // OK
M.y = 3; // OK
M.y = 3; // OK
M.y = ''; // Error
M.y = ''; // Error
M.y = ''; // Error
M = {
    y: 3
}; // Error
M = {
    y: 3
}; // Error
var M2;
(function(M21) {
    let M31;
    (function(M3) {
        var x1;
        M3.x = x1;
    })(M31 = M21.M3 || (M21.M3 = {}));
    M31 = {
        x: 3
    }; // Error
})(M2 || (M2 = {}));
M2.M3 = {
    x: 3
}; // OK
M2.M3 = {
    x: 3
}; // OK
M2.M3 = {
    x: 3
}; // OK
M2.M3 = {
    x: ''
}; // Error
M2.M3 = {
    x: ''
}; // Error
M2.M3 = {
    x: ''
}; // Error
function fn() {}
fn = ()=>3; // Bug 823548: Should be error (fn is not a reference)
fn = ()=>3; // Should be error
function fn2(x2, y) {
    x2 = 3;
    x2 = 3; // OK
    x2 = ''; // Error
    x2 = ''; // Error
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
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
E = undefined; // Error
E = undefined; // Error
class C {
}
C = undefined; // Error
C = undefined; // Error
