//// [autoAccessor8.ts]
class C1 {
    accessor a;
    static accessor b;
}
function f() {
    class C3 {
        accessor a;
        static accessor b;
    }
    return C3;
}
