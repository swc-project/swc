//// [accessorsOverrideMethod.ts]
class A {
    m() {}
}
class B extends A {
    get m() {
        return ()=>1;
    }
}
