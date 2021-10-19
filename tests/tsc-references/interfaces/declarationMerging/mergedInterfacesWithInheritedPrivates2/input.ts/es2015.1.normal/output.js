class C {
}
class C2 {
}
class D extends C {
}
class E extends C2 {
}
var a;
var r = a.x; // error
var r2 = a.w; // error
