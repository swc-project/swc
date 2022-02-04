// @strictNullChecks: true
class B {
}
class C extends B {
    body() {
        super.m && super.m();
    }
}
