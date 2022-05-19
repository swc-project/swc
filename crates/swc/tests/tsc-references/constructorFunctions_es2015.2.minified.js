function C1() {
    if (!(this instanceof C1)) return new C1();
    this.x = 1;
}
C1(), new C1();
var C2 = function() {
    if (!(this instanceof C2)) return new C2();
    this.x = 1;
};
function C3() {
    if (!(this instanceof C3)) return new C3();
}
C2(), new C2(), C3(), new C3();
var C4 = function() {
    if (!(this instanceof C4)) return new C4();
};
C4(), new C4(), new class {
}(), new function() {
    this.functions = [
        (x)=>x,
        (x)=>x + 1,
        (x)=>x - 1
    ];
}();
