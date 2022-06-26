// @allowUnusedLabels: true
// typeof  operator on number type
var NUMBER;
var NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
}
class A {
    static foo() {
        return 1;
    }
}
var M;
(function(M) {
    var n;
    M.n = n;
})(M || (M = {}));
var objA = new A();
// number type var
var ResultIsString1 = typeof NUMBER;
var ResultIsString2 = typeof NUMBER1;
// number type literal
var ResultIsString3 = typeof 1;
var ResultIsString4 = typeof {
    x: 1,
    y: 2
};
var ResultIsString5 = typeof {
    x: 1,
    y: (n)=>{
        return n;
    }
};
// number type expressions
var ResultIsString6 = typeof objA.a;
var ResultIsString7 = typeof M.n;
var ResultIsString8 = typeof NUMBER1[0];
var ResultIsString9 = typeof foo();
var ResultIsString10 = typeof A.foo();
var ResultIsString11 = typeof (NUMBER + NUMBER);
// multiple typeof  operators
var ResultIsString12 = typeof typeof NUMBER;
var ResultIsString13 = typeof typeof typeof (NUMBER + NUMBER);
// miss assignment operators
typeof 1;
typeof NUMBER;
typeof NUMBER1;
typeof foo();
typeof objA.a;
typeof M.n;
typeof objA.a, M.n;
// use typeof in type query
var z;
var x;
z: typeof NUMBER;
x: typeof NUMBER1;
r: typeof foo;
var y = {
    a: 1,
    b: 2
};
z: typeof y.a;
z: typeof objA.a;
z: typeof A.foo;
z: typeof M.n;
