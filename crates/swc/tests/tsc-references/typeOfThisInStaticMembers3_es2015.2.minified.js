class C {
}
C.a = 1, C.b = C.a + 1;
class D extends C {
}
D.c = 2, D.d = D.c + 1, D.e = super.a + D.c + 1;
