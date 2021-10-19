var ctor1, ctor2, ctor3, ctor4, ctor5, ctor6;
class C1 {
}
class C2 {
}
class D1 extends C1 {
}
ctor1 instanceof C1 && ctor1.p1, ctor1 instanceof C2 && ctor1.p2, ctor1 instanceof D1 && ctor1.p1, ctor1 instanceof D1 && ctor1.p3, ctor2 instanceof C2 && ctor2.p2, ctor2 instanceof D1 && ctor2.p3, ctor2 instanceof D1 && ctor2.p1, ctor2 instanceof C1, ctor3 instanceof C1 ? ctor3.p1 : ctor3.p2, ctor4 instanceof C1 ? ctor4.p1 : ctor4 instanceof C2 ? ctor4.p2 : ctor4.p4, ctor5 instanceof C1 ? ctor5.p1 : ctor5.p2, ctor6 instanceof C1 || ctor6 instanceof C2 || ctor6.p4;
