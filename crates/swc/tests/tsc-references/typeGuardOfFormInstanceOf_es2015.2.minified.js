var ctor2, ctor3, ctor4, ctor5, ctor6;
class C1 {
}
class C2 {
}
ctor2 instanceof C1, ctor3 instanceof C1 ? ctor3.p1 : ctor3.p2, ctor4 instanceof C1 ? ctor4.p1 : ctor4 instanceof C2 ? ctor4.p2 : ctor4.p4, ctor5 instanceof C1 ? ctor5.p1 : ctor5.p2, ctor6 instanceof C1 || ctor6 instanceof C2 || ctor6.p4;
