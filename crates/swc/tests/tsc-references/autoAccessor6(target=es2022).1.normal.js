//// [autoAccessor6.ts]
class C1 {
    accessor a;
}
class C2 extends C1 {
    a = 1;
}
class C3 extends C1 {
    get a() {
        return super.a;
    }
}
