// any is not a valid type argument unless there is no constraint, or the constraint is any
function foo(x) {
    return null;
}
function foo2(x) {
    return null;
}
//function foo3<T extends T[]>(x: T): T { return null; }
function foo4(x) {
    return null;
}
var a;
foo(a);
foo2(a);
//foo3(a);
foo4(a);
var b;
foo(b);
foo2(b);
//foo3<any>(b);
foo4(b);
//function foo5<T extends String, U extends T>(x: T, y: U): T { return null; }
//foo5(a, a);
//foo5<any, any>(b, b);
class C {
    constructor(x){
        this.x = x;
    }
}
var c1 = new C(a);
var c2 = new C(b);
class C2 {
    constructor(x1){
        this.x = x1;
    }
}
var c3 = new C2(a);
var c4 = new C2(b);
//class C3<T extends T[]> {
//    constructor(public x: T) { }
//}
//var c5 = new C3(a);
//var c6 = new C3<any>(b);
class C4 {
    constructor(x2){
        this.x = x2;
    }
}
var c7 = new C4(a);
var c8 = new C4(b);
