class A {
    constructor(){
        this.a = 10;
    }
}
class C {
}
class D {
}
class E extends A {
}
class F extends A {
}
let E1;
(function(E1) {
    E1[E1["one"] = 0] = "one";
})(E1 || (E1 = {
}));
let E2;
(function(E2) {
    E2[E2["one"] = 0] = "one";
})(E2 || (E2 = {
}));
// no error
var numStrTuple = [
    5,
    "foo"
];
var emptyObjTuple = numStrTuple;
var numStrBoolTuple = numStrTuple;
var shorter = numStrBoolTuple;
var longer = numStrTuple;
var classCDTuple = [
    new C(),
    new D()
];
var interfaceIITuple = classCDTuple;
var classCDATuple = classCDTuple;
var eleFromCDA1 = classCDATuple[2]; // A
var eleFromCDA2 = classCDATuple[5]; // C | D | A
var t10 = [
    E1.one,
    E2.one
];
var t11 = t10;
var array1 = emptyObjTuple;
var unionTuple = [
    new C(),
    "foo"
];
var unionTuple2 = [
    new C(),
    "foo",
    new D()
];
var unionTuple3 = [
    10,
    "foo"
];
var unionTuple4 = unionTuple3;
// error
var t3 = numStrTuple;
var t9 = classCDTuple;
var array1 = numStrTuple;
t4[2] = 10;
