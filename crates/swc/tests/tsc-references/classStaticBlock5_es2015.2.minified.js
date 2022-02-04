class B {
}
B.a = 1, B.b = 2;
class C extends B {
}
C.b, super.b, super.a, C.b = 3, C.c = super.a;
