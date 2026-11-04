class Foo {
    method() {
        return super.f || (super.f = b);
    }
}
