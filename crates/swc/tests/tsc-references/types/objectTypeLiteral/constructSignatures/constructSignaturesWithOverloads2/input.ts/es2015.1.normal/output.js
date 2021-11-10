// No errors expected for basic overloads of construct signatures with merged declarations
// clodules
class C1 {
    constructor(x){
    }
}
(function(C) {
    C.x = 1;
})(C1 || (C1 = {
}));
var r1 = new C1(1, '');
class C21 {
    constructor(x1){
    }
}
(function(C2) {
    C2.x = 1;
})(C21 || (C21 = {
}));
var r2 = new C21(1, '');
var i2;
var r4 = new i2(1, '');
var r5 = new i2(1, 1);
