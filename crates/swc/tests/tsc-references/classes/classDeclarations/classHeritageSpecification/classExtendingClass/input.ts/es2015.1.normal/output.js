class C {
    thing() {
    }
    static other() {
    }
}
class D extends C {
}
var d;
var r = d.foo;
var r2 = d.bar;
var r3 = d.thing();
var r4 = D.other();
class C2 {
    thing(x) {
    }
    static other(x1) {
    }
}
class D2 extends C2 {
}
var d2;
var r5 = d2.foo;
var r6 = d2.bar;
var r7 = d2.thing('');
var r8 = D2.other(1);
