//// [accessorsOverrideProperty5.ts]
class B {
}
class C extends B {
    get p() {
        return 1;
    }
    set p(value) {}
}
