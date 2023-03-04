//// [autoAccessor7.ts]
class C1 {
    accessor a;
}
class C2 extends C1 {
    accessor a = 1;
}
class C3 extends C1 {
    get a() {
        return 1;
    }
}
